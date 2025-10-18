import { useCallback } from "react";

export function useNavigate() {
  const navigate = useCallback((path: string, params?: Record<string, string>) => {
    let url = path;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    // Update URL without page reload
    window.history.pushState({}, "", url);

    // Dispatch a custom event to notify components of navigation
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return navigate;
}
