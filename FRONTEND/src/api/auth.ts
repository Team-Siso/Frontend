export const login = async (email: string, password: string): Promise<{ id: number; email: string }> => {
    try {
      const params = new URLSearchParams({ email, password });
      const response = await fetch(`http://43.203.231.200:8080/api/v1/members/login?${params.toString()}`, {
        method: "POST",
      });
  
      if (!response.ok) {
        const errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        console.error("Response error message:", await response.text());
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log("Response data:", data);
  
      if (!data || !data.id) {
        throw new Error("Invalid response: memberId is missing");
      }
  
      return data;
    } catch (error) {
      console.error("로그인 실패:", error);
      throw error;
    }
  };
  