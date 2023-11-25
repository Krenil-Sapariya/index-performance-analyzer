import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

const analyzeData = async (data) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/analyze', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }catch (err) {
        throw new Error(err.message);
    }
};

const useAnalyzeData = (data) => {
    const {mutate, isLoading} = useMutation(analyzeData, {
        onSuccess: data => console.log(data)
    });

    return {mutate, isLoading}
}

export {useAnalyzeData};