import '../globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FetchButton from '@/app/(user_page)/(components)/Button';
import {Suspense} from "react";
import Loading from "@/app/(user_page)/loading";
import axios from "axios";
import BookTable from "@/app/(user_page)/(components)/BookTable";


async function fetchBooks() {
    // const res = await fetch("https://restcountries.com/v3.1/name/Viet");
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable SSL verification
    // const res = await axios.get(`http://localhost:5120/getbooks`)
    // if (res.status !== 200) {
    //     throw new Error("Failed to fetch data");
    // }
    // return res.data;
}

export default async function Home(

) {

    const books = await fetchBooks();


  return (
      <div>
            <p>This is Home Page</p>
      </div>
  );
}

