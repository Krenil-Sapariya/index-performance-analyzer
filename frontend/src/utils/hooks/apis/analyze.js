import axios from 'axios';
import { useMutation } from 'react-query';

const analyzeData = (data) => {
    try {
        return axios.post('http://127.0.0.1:8000/analyze', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            console.log(response)
            return response.data
        }
        );
    }catch (err) {
        throw new Error(err.message);
    }
};

const useAnalyzeData = (params) => {
    const {data, mutate, isLoading} = useMutation((params) => analyzeData(params), {
        onSuccess: data => data
    });

    return {data, mutate, isLoading};
}

export {useAnalyzeData};