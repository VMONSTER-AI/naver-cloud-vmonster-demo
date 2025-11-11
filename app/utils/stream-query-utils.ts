import { fetchRequest, handleFetchResponse } from "./query-utils";

export interface NewStreamLivekitConfig {
  aiAvatarId: string;
  language: string;
  scale?: number;
}

export interface LivekitStreamData {
  token: string;
  session_id: string;
  stream_id: string;
}

export async function requestNewStreamLivekit(
  config: NewStreamLivekitConfig,
  signal?: AbortSignal
): Promise<LivekitStreamData> {
  const formData = new FormData();
  formData.append("aiavatar_id", config.aiAvatarId);
  formData.append("language", config.language);

  const response = await fetchRequest({
    method: "POST",
    endpoint: "/streams",
    body: formData,
    signal,
  });

  const data = await handleFetchResponse(response);

  if (!isLivekitStreamData(data)) {
    throw new Error("Server Error: returned of non-StreamData");
  }
  return data;
}

function isLivekitStreamData(data: {
  token: string;
  session_id: string;
}): data is LivekitStreamData {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.token === "string" &&
    typeof data.session_id === "string"
  );
}
