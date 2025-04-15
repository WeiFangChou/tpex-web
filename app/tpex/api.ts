export async function fetchFinances(page = 1, limit = 10) {
    const res = await fetch(
        `http://127.0.0.1:3030/api/fiances?page=${page}&limit=${limit}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );
    const data = await res.json();
    return data.data;
}