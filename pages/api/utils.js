export const mohallahList = {
  "BADRI MOHALLAH": "#A9D18E",
  "BURHANI MOHALLAH": "#9954CC",
  "EZZI MOHALLAH": "#FF75AD",
  "FATEMI MOHALLAH": "#FFC000",
  "HAKIMI MOHALLAH": "#4472C4",
  "JAMALI MOHALLAH": "#AFABAB",
  "MOHAMMEDI MOHALLAH": "#767171",
  "NAJMI MOHALLAH": "#D3E210",
  "SAIFEE MOHALLAH": "#8FAADC",
  "SHUJAYI MOHALLAH": "#00B050",
  "VAJIHI MOHALLAH": "#C55A11",
  "ZAINEE MOHALLAH": "#5B9BD5",
};

export const getSectorColor = (name) => {
  return mohallahList[name];
};

export const getMohallahName = (name) => {
  return name.split(" ")[0];
};
