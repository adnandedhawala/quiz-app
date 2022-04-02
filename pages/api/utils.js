export const getSectorColor = (name) => {
    const data = {
        "BADRI MOHALLAH": "#A9D18E",
        "SAIFEE MOHALLAH": "#8FAADC",
        "FATEMI MOHALLAH": "#FFC000",
        "JAMALI MOHALLAH": "#AFABAB",
        "ZAINEE MOHALLAH": "#5B9BD5",
        "BURHANI MOHALLAH": "#9954CC",
        "EZZI MOHALLAH": "#FF75AD",
        "VAJIHI MOHALLAH": "#C55A11",
        "SHUJAYI MOHALLAH": "#00B050",
        "HAKIMI MOHALLAH": "#4472C4",
        "NAJMI MOHALLAH": "#D3E210",
        "MOHAMMEDI MOHALLAH": "#767171"
    }
    return data[name]
}