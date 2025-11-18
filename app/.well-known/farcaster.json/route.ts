function withValidProperties(
  properties: Record<string, undefined | string | string[]>
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) =>
      Array.isArray(value) ? value.length > 0 : !!value
    )
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  return Response.json({
    accountAssociation: {
      header:
        "eyJmaWQiOjE0ODQ1NjIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhkNWU5NUFkMDQ5NkUwOTBBZjlENzJmYkZDMjVFQmFERkI5YzdEYzZBIn0",
      payload: "eyJkb21haW4iOiJib290bml0ZS1zdG9yZS52ZXJjZWwuYXBwIn0",
      signature:
        "hg3WbHJOi4z3HVTUeAYAl215DyV1jrjTH232dYp8HXdesuqmB02RamKCYs7Eqfzs75jYnrparfwovWzH7LRKDBs=",
    },
    miniapp: {
      version: "1",
      name: "Botnite Store",
      homeUrl:
        "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406429/Gemini_Generated_Image_roqu2wroqu2wroqu-removebg-preview_ktxto3.png",
      iconUrl:
        "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406429/Gemini_Generated_Image_roqu2wroqu2wroqu-removebg-preview_ktxto3.png",
      splashImageUrl: "https://ex.co/l.png",
      splashBackgroundColor: "#000000",
      webhookUrl: "https://ex.co/api/webhook",
      subtitle: "Ultimate Botnite Gear",
      description: "Discover the ultimate Botnite gear and accessories.",
      screenshotUrls: [
        "https://ex.co/s1.png",
        "https://ex.co/s2.png",
        "https://ex.co/s3.png",
      ],
      primaryCategory: "social",
      tags: ["example", "miniapp", "baseapp"],
      heroImageUrl: "https://ex.co/og.png",
      tagline: "Play instantly",
      ogTitle: "Example Mini App",
      ogDescription: "Challenge friends in real time.",
      ogImageUrl: "https://ex.co/og.png",
      noindex: true,
    },
    baseBuilder: {
      ownerAddress: "0xd3a2c511d7B4C192dFDF5B78041f142Af715fcBd",
    },
  }); // see the next step for the manifest_json_object
}
