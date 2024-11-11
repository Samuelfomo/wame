export async function copyReference(text: string) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Texte copié dans le presse-papiers !");
  } catch (err) {
    console.error("Erreur lors de la copie : ", err);
  }
}
