import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string, sheetName: string = 'Datos') {
  if (data.length === 0) return;

  // Creamos un libro de trabajo
  const wb = XLSX.utils.book_new();

  // Convertimos la data (JSON) a una hoja
  const ws = XLSX.utils.json_to_sheet(data);

  // --- Opciones de Estilo y Formato ---
  // Obtener las claves (nombres de las columnas)
  const keys = Object.keys(data[0]);
  
  // Asignar anchos de columna automáticos básicos
  const colWidths = keys.map(key => {
    return { wch: Math.max(key.length, 15) };
  });
  ws['!cols'] = colWidths;

  // Añadir la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Escribir y descargar
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
