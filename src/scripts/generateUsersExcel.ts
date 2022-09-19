import excelJS from 'exceljs';

import { tmpFolderPath } from '~/configs';
import { api } from '~/services';

const generateUsersExcel = async () => {
  const workbook = new excelJS.Workbook();

  const worksheet = workbook.addWorksheet('Médicos');

  worksheet.columns = [
    { header: 'Nome', key: 'name', width: 50 },
    {
      header: 'Permissão',
      key: 'role',
      width: 30,
    },
    {
      header: 'Status',
      key: 'status',
      width: 20,
    },
  ];

  const { data: users } = await api.get<any[]>('/users');

  users.forEach((user) => {
    switch (user.role) {
      case 'ADMIN':
        user.role = 'Administrador';
        break;

      case 'ATTENDANCE':
        user.role = 'Atendimento';
        break;

      case 'CLINIC':
        user.role = 'Unidade de atendimento';
        break;

      default:
        break;
    }

    if (user.status === 'ACTIVE') {
      user.status = 'Ativo';
    } else {
      user.status = 'Inativo';
    }

    const rows: Record<string, string> = {};

    ['name', 'role', 'status'].forEach((key) => {
      rows[key] = user[key];
    });

    worksheet.addRow(rows);
  });

  await workbook.xlsx.writeFile(`${tmpFolderPath}/Usuários.xlsx`);

  console.info('Done!');
};

export default generateUsersExcel;
