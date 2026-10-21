"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePhoto } from "@/app/conta/actions";

async function portrait(file: File) {
  const image = document.createElement("img");
  const url = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("foto"));
      image.src = url;
    });
    const side = Math.min(image.width, image.height);
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 480;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("foto");
    context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 480, 480);
    let quality = 0.82;
    let data = canvas.toDataURL("image/jpeg", quality);
    while (data.length > 170_000 && quality > 0.45) {
      quality -= 0.08;
      data = canvas.toDataURL("image/jpeg", quality);
    }
    return data;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PhotoUpload({ current, initials }: { current: string | null; initials: string }) {
  const router = useRouter();
  const [preview, setPreview] = useState(current);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const shown = preview || current;

  return (
    <div className="credential-photo">
      {shown ? (
        <img src={shown} alt="" width={136} height={136} />
      ) : (
        <span className="credential-initials" aria-hidden="true">{initials}</span>
      )}
      <label className="photo-button">
        {pending ? "Guardando..." : shown ? "Trocar foto" : "Colocar foto"}
        <input
          className="sr-only"
          type="file"
          accept="image/*"
          disabled={pending}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setPending(true);
            setMessage("");
            try {
              const photo = await portrait(file);
              const body = new FormData();
              body.set("photo", photo);
              const result = await savePhoto(body);
              if ("error" in result) {
                setMessage(result.error);
                setPending(false);
                return;
              }
              setPreview(photo);
              router.refresh();
            } catch {
              setMessage("Não foi possível usar esta imagem.");
            } finally {
              setPending(false);
            }
          }}
        />
      </label>
      {message ? <p className="photo-message">{message}</p> : null}
    </div>
  );
}
