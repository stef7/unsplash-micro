import type { NextApiRequest, NextApiResponse } from "next";
import { createApi } from "unsplash-js";

export type UnsplashResponseData = {
  results:
    | null
    | {
        id: string;
        url: string;
        username: string;
        description: string | null;
        width: number;
        height: number;
        link: string;
      }[];
};

const unsplashApi = createApi({
  /**
   * I'd hide this in a private env value with more time.
   * For now I am semi-hiding it in /api route.
   */
  accessKey: "_HNMJ0qUdxstUdTZACuPHBfc8amEuocX_APi_gEhnTM",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UnsplashResponseData>
) {
  const { q } = req.query;
  const query = Array.isArray(q) ? q.join(" ") : q;

  const { response } = await unsplashApi.search.getPhotos({ query });

  const results =
    response?.results.map((result) => ({
      id: result.id,
      url: result.urls.regular,
      username: result.user.name,
      description: result.alt_description,
      width: result.width,
      height: result.height,
      link: result.links.html,
    })) ?? null;

  res.status(200).json({ results });
}
