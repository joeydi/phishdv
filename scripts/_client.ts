import { config } from "dotenv";

config({ path: ".env.local" });

const API_KEY = process.env.PHISHNET_API_KEY;
if (!API_KEY) {
    throw new Error("Missing PHISHNET_API_KEY in .env.local");
}

const BASE_URL = "https://api.phish.net/v5";

type PhishNetResponse<T> = {
    error: boolean;
    error_message: string;
    data: T[];
};

export async function fetchPhishNet<T>(resource: string): Promise<T[]> {
    const url = `${BASE_URL}/${resource}.json?apikey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Phish.net ${resource} HTTP ${res.status}: ${await res.text()}`);
    }
    const payload = (await res.json()) as PhishNetResponse<T>;
    if (payload.error) {
        throw new Error(`Phish.net ${resource} API error: ${payload.error_message}`);
    }
    return payload.data ?? [];
}
