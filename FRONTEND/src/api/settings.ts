export const updateToggleSetting = async (setting: string, value: boolean): Promise<void> => {
    const response = await fetch("http://43.203.231.200:8080/api/v1/settings/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ setting, value }),
    });
  
    if (!response.ok) {
      throw new Error(`Failed to update ${setting} setting.`);
    }
  };
  