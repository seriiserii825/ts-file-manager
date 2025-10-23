import chalkMultiSelect from "../utils/chalkMultiSelect.js";

export default async function mainMenu(): Promise<string[]> {
  const message = "Select an option:";
  const menu_options = [
    { label: "1.Seo all", value: "seo_all" },
    { label: "2.Seo missing", value: "seo_missing" },
    { label: "3.Images alt missing", value: "missing_alt" },
    { label: "4.Links empty", value: "links_empty" },
    { label: "5.Links external", value: "links_external" },
    { label: "6.Links broken hash", value: "links_broken_hash" },
    { label: "7.Phone whatsapp", value: "phone_whatsapp" },
    { label: "8.Ids duplicates", value: "ids_duplicates" },
    { label: "9.Lorem", value: "lorem" },
    { label: "10.Exit", value: "exit" },
  ];

  return chalkMultiSelect({
    message: message,
    options: menu_options,
  });
}
