import { parseApiEnvelope } from '../utils/asyncUtils/parseApiEnvelope';

export default function useApiResponseHandler() {
  const handleApiResponse = (response, { onSuccess, onError } = {}) => {
    const envelope = parseApiEnvelope(response);
    if (envelope.ok) {
      onSuccess?.(envelope);
    } else {
      onError?.(envelope);
    }
  };

  return handleApiResponse;
}
