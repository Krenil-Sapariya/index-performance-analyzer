import math
from sql_metadata import Parser
import random

def analyze(data):
    # print(data)
    blocking_factor = int(data['blockingFactor'])
    row_ip = data['table']
    # row_ip = [
    #     {
    #         'name': 'employees',
    #         'nr': 100000,
    #         'columns': [
    #             {
    #                 'name': 'first_name', 'distinct': 10000, 'max': None, 'min': None, 'index': False, 'height': None
    #             },
    #             {
    #                 'name': 'last_name', 'distinct': 10000, 'max': None, 'min': None, 'index': False, 'height': None
    #             },
    #             {
    #                 'name': 'salary', 'distinct': 10000, 'max': None, 'min': None, 'index': False, 'height': None
    #             },
    #             {
    #                 'name': 'employee_id', 'distinct': 10000, 'max': None, 'min': None, 'index': False, 'height': None
    #             },
    #             {
    #                 'name': 'location_id', 'distinct': 10000, 'max': None, 'min': None, 'index': False, 'height': None
    #             },
    #             {
    #                 'name': 'department_id', 'distinct': 10000, 'max': 200, 'min': 1, 'index': False, 'height': None
    #             }
    #         ]
    #     },
    #     {
    #         'name' : 'departments',
    #         'nr' : 4,
    #         'columns' : [
    #             {
    #                 'name': 'department_id', 'distinct': 10000, 'max': 200, 'min': 1, 'index': False, 'height': None
    #             },
    #             {
    #                 'name': 'department_name', 'distinct': 10000, 'max': None, 'min': None, 'index': False, 'height': None
    #             },
    #             {
    #                 'name': 'location_id', 'distinct': 10000, 'max': None, 'min': None, 'index': False, 'height': None
    #             },
    #         ]
    #     }
    # ]

    metadata = arrange_metadata(row_ip)

    query_list = data['queries']

    # query_list = [
    #     'SELECT * FROM employees',
    #     'SELECT employee_id, first_name, last_name FROM employees',
    #     'SELECT employee_id, last_name FROM employees',
    #     'SELECT employee_id, first_name FROM employees',
    #     'SELECT first_name, last_name FROM employees',
    #     'SELECT first_name FROM employees',
    #     'SELECT DISTINCT department_id FROM employees',
    #     'SELECT * FROM employees WHERE department_id = 10',
    #     'SELECT * FROM employees WHERE salary > 50000 AND department_id = 20',
    #     'SELECT employees.employee_id, employees.first_name, employees.last_name, departments.department_name FROM employees INNER JOIN departments ON employees.department_id = departments.department_id',
    #     'SELECT e.employee_id, e.first_name, e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id',
    #     'SELECT employees.employee_id, employees.first_name, employees.last_name, departments.department_name FROM employees RIGHT JOIN departments ON employees.department_id = departments.department_id',
    #     'SELECT employees.employee_id, employees.first_name, employees.last_name, departments.department_name FROM employees LEFT JOIN departments ON employees.department_id = departments.department_id',
    #     'SELECT employees.employee_id, employees.first_name, employees.last_name, departments.department_name FROM employees FULL OUTER JOIN departments ON employees.department_id = departments.department_id',
    #     'SELECT employees.employee_id, employees.first_name, employees.last_name, departments.department_name FROM employees INNER JOIN departments ON employees.department_id = departments.department_id AND employees.location_id = departments.location_id',
    #     'SELECT employees.employee_id, employees.first_name, employees.last_name, departments.department_name FROM employees INNER JOIN departments ON employees.department_id = departments.department_id WHERE employees.salary > 50000'
    # ]

    selection_queries, join_queries = identify_query(query_list = query_list)

    # print(selection_queries,'\n\n\n\n\n\n', join_queries)
    
    linear_cost, binary_cost = cost_without_index(blocking_factor=blocking_factor, metadata=metadata, query_list=selection_queries)

    # print(linear_cost, binary_cost)

    cost = cost_with_index(blocking_factor=blocking_factor, metadata=metadata, query_list=selection_queries)
    # print(cost)

    nested_loop, block_nested_loop = join_cost_without_index(blocking_factor=blocking_factor, metadata=metadata, query_list=join_queries)
    # print(nested_loop, block_nested_loop)

    index_nested_loop = join_cost_with_index(blocking_factor=blocking_factor, metadata=metadata, query_list=join_queries)
    # print(index_nested_loop)

    response = format_response(linear=linear_cost, binary=binary_cost, indexed=cost, nl=nested_loop, bnl=block_nested_loop, inl=index_nested_loop)

    return response

def arrange_metadata(data):
    metadata = {}
    for table in data:
        if table['name'] not in metadata.keys():
            metadata[table['name']] = {
                'nr' : int(table['nr']),
            }
            for column in table['columns']:
                # print(column)
                metadata[table['name']][column['name']] = {
                    'distinct': int(column['distinct']), 'max': column['max'], 'min' : column['min'], 'index': column['index'], 'height': column['height']
                }
    return metadata

def identify_query(query_list):
    selection, join = [], []
    for query in query_list:
        if 'JOIN' in query:
            join.append(query)
        else:
            selection.append(query)
    return (selection, join)

def height_of_index(nr, fanout=100):
    return math.ceil(math.log(nr, fanout))

def identify_table(sql_query):
    return Parser(sql_query).tables

def identify_column(sql_query):
    return Parser(sql_query).columns

def identify_join_column(sql_query):
    return Parser(sql_query).columns_dict['join']

def cost_without_index(blocking_factor, metadata, query_list):
    linear, binary = 0, 0
    for query in query_list:
        tables = identify_table(query)
        for table in tables:
            if table not in metadata:
                return 'Table metadata is not provided for table-name: {table}'
            br = math.ceil(metadata[table]['nr'] / blocking_factor)
            linear += br
            binary += math.log(br, 2)
    return (linear, binary)

def cost_with_index(blocking_factor, metadata, query_list):
    cost = {}
    for query in query_list:
        columns = identify_column(query)
        tables = identify_table(query)
        for table in tables:
            for col in columns:
                if col!='*':
                    if '.' in col:
                        table = col.split('.')[0]
                        col = col.split('.')[1]
                    idx_height = height_of_index(metadata[table]['nr']) if metadata[table][col]['index']==False else metadata[table][col]['height']
                    br = math.ceil(metadata[table]['nr'] / blocking_factor)

                    if col not in cost.keys():
                        cost[col] = [0]*6
                    cost[col][0] += br
                    cost[col][1] += int(idx_height)+1+random.randint(1, 50)
                    cost[col][5] += 1
    for k,v in cost.items():
        v[2] = v[0]-v[1]
        v[3] = v[1]*100 / v[0]
        v[4] = v[2]*100 / v[0]
    return cost

def join_cost_without_index(blocking_factor, metadata, query_list):
    nested_loop_join = {}
    block_nested = {}
    for query in query_list:
        tables = [i.split('.')[0] for i in identify_join_column(query)][:2]

        br = math.ceil(metadata[tables[0]]['nr'] / blocking_factor)
        bs = math.ceil(metadata[tables[1]]['nr'] / blocking_factor)

        if ' join '.join(i for i in tables) not in nested_loop_join.keys():
            nested_loop_join[' join '.join(i for i in tables)] = 0
            block_nested[' join '.join(i for i in tables)] = 0

            nested_loop_join[' join '.join(i for i in tables[::-1])] = 0
            block_nested[' join '.join(i for i in tables[::-1])] = 0

        nested_loop_join[' join '.join(i for i in tables)] += metadata[tables[0]]['nr']*bs + br
        nested_loop_join[' join '.join(i for i in tables[::-1])] += metadata[tables[1]]['nr']*br + bs

        block_nested[' join '.join(i for i in tables)] += br*bs + br
        block_nested[' join '.join(i for i in tables[::-1])] += bs*br + bs
        

    # print('nested loop join', nested_loop_join)
    # print('block nested loop join', block_nested)
    return (nested_loop_join, block_nested)

def join_cost_with_index(blocking_factor, metadata, query_list):
    index_nested_loop = {}
    for query in query_list:
        join_col = identify_join_column(query)
        tables = [i.split('.')[0] for i in join_col][:2]
        br = math.ceil(metadata[tables[0]]['nr'] / blocking_factor)
        bs = math.ceil(metadata[tables[1]]['nr'] / blocking_factor)

        if ' join '.join(i for i in tables) not in index_nested_loop.keys():
            index_nested_loop[' join '.join(i for i in tables)] = 0
            index_nested_loop[' join '.join(i for i in tables[::-1])] = 0
        
        height = height_of_index(metadata[tables[1]]['nr']) if metadata[tables[1]][join_col[1].split('.')[1]]['height']==0 else metadata[tables[1]][join_col[1].split('.')[1]]['height']
        # print('=============================', metadata[tables[1]][join_col[1].split('.')[1]])
        index_nested_loop[' join '.join(i for i in tables)] += metadata[tables[0]]['nr']*(height+1) + br

        height = height_of_index(metadata[tables[0]]['nr']) if metadata[tables[0]][join_col[0].split('.')[1]]['height']==0 else metadata[tables[0]][join_col[0].split('.')[1]]['height']
        # print('=============================', height)
        index_nested_loop[' join '.join(i for i in tables[::-1])] += metadata[tables[1]]['nr']*(height+1) + bs

    return index_nested_loop

def format_response(linear, binary, indexed, nl, bnl, inl):
    response = {}

    response['linear_selection_cost'] = linear
    response['binary_selection_cost'] = binary
    response['indexed_selection_cost'] = indexed
    response['nested_loop_join_cost'] = nl
    response['block_nested_loop_join_cost'] = bnl
    response['indexed_nested_join_cost'] = inl

    return response