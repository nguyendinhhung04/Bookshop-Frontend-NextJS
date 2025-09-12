'use client'

import axios from "axios";

export default function FetchButton(

) {


    const onClick =  () => {

        axios.get('https://localhost:7024/getbooks')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    return (
        <button
            onClick={onClick}
        >
            Click me
        </button>
    );
}