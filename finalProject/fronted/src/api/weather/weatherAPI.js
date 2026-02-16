import { axiosApi } from "../core/axiosAPI";

/**
 * 제주도 날씨 조회
 * @param {string} city - "jeju" 또는 "seogwipo"
 */
export async function getJejuWeather(city = "jeju") {
  const response = await axiosApi.get("/api/weather/jeju", {
    params: { city },
  });
  return response.data;
}
