

import 'bootstrap/dist/css/bootstrap.min.css';

export default async function Home(

) {

    const data = await fetch('http://127.0.0.1:5120/getbooks', { cache: 'force-cache' });
    const res = await data.json();
    console.log(res);

    return (
        <div>
            <main className="p-4">
                <h2>This is My Cart page </h2>
            </main>
        </div>
    );
}

