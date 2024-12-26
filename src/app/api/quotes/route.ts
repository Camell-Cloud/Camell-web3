import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "";

    const apiKey = process.env.NEXT_PUBLIC_COINMARKETCAP_API || "";

    const result = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching from CoinMarketCap:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
