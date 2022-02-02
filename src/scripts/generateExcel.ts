import excelJS from 'exceljs';

import { tmpFolderPath } from '~/configs';
import { api } from '~/services';

const generateExcel = async () => {
  const workbook = new excelJS.Workbook();

  const worksheet = workbook.addWorksheet('Médicos');

  worksheet.columns = [
    { header: 'Id', key: 'id', width: 40 },
    { header: 'Nome', key: 'name', width: 40 },
    {
      header: 'Observações importantes',
      key: 'importantObservations',
      width: 120,
    },
    {
      header: 'Informações adicionais',
      key: 'additionalInformations',
      width: 120,
    },
  ];

  const { data: doctors } = await api.get<any[]>('/doctors');

  doctors.forEach((doctor) => {
    doctor.importantObservations = doctor.importantObservations.join(',\n');

    doctor.additionalInformations = doctor.additionalInformations.join(',\n');

    worksheet.addRow({
      id: doctor.id,
      name: doctor.name,
      importantObservations: doctor.importantObservations,
      additionalInformations: doctor.additionalInformations,
    });
  });

  await workbook.xlsx.writeFile(`${tmpFolderPath}/medicos.xlsx`);

  console.info('Done!');
};

export default generateExcel;
