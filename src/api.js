import json from "./data.json";

export async function getData() {
    return Promise.resolve(json);
}