import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, WeatherData } from "../../types";

/**
 * 제주도 날씨 조회
 * @param city - "jeju" 또는 "seogwipo"
 */
export async function getJejuWeather(city = "jeju"): Promise<ApiResponse<WeatherData>> {
  const response = await axiosApi.get("/api/weather/jeju", {
    params: { city },
  });
  return response.data;
}

export interface ForecastDay {
  date: string;
  label: string;
  sky: number;
  ptyCode: number;
  tmin: number;
  tmax: number;
}

export async function getJejuForecast(city = "jeju"): Promise<ApiResponse<ForecastDay[]>> {
  const response = await axiosApi.get("/api/weather/forecast", {
    params: { city },
  });
  return response.data;
}
