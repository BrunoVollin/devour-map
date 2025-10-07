export async function getClientIpAndLocation(): Promise<{ ip: string; location: string }> {

    const ip = "189.126.230.18";
  // Busca a localização via API externa
  let location = "unknown";
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (res.ok) {
        console.log(res.ok);
      const data = await res.json();
      location = `${data.city || "?"}, ${data.region || "?"}, ${data.country_name || "?"}`;
    }
  } catch (e) {
    console.log(JSON.stringify(e));
    console.error("Erro ao buscar localização:", e);
  }
  console.log({ ip, location })
  return { ip, location };
}
getClientIpAndLocation();

