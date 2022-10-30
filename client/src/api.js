export let api = "";

const isProduction = import.meta.env.PROD;

if (isProduction) {
    api = "certs"
}
else {
    api = "http://localhost:3000/certs"
}

export async function getCerts() {
    const res = await fetch(`${api}/`);

    const certs = await res.json();
    return certs;
}
