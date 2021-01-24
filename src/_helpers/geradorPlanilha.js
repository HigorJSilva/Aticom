const XlsxPopulate = require('xlsx-populate');

XlsxPopulate.fromFileAsync("../files/Atividades_Complementares.xlsm")
    .then(workbook => {
        // Modify the workbook.
        const value = workbook.sheet("Formulário 2019").cell("A1").value();

        // Log the value.
        console.log(value);
    });