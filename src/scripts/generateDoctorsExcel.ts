import excelJS from 'exceljs';

import { tmpFolderPath } from '~/configs';
import { api } from '~/services';

const generateDoctorsExcel = async () => {
  const workbook = new excelJS.Workbook();

  const worksheet = workbook.addWorksheet('Médicos');

  worksheet.columns = [
    { header: 'Nome', key: 'name', width: 40 },
    {
      header: 'Gênero',
      key: 'gender',
      width: 20,
    },
    {
      header: 'E-mail',
      key: 'email',
      width: 20,
    },
    {
      header: 'Conselho profissional',
      key: 'council',
      width: 20,
    },
    {
      header: 'CRM',
      key: 'crm',
      width: 20,
    },
    {
      header: 'UF',
      key: 'uf',
      width: 20,
    },
    {
      header: 'N° de telefone',
      key: 'phone',
      width: 20,
    },
    {
      header: 'N° de whatsapp',
      key: 'whatsapp',
      width: 20,
    },
    {
      header: 'Especialidades',
      key: 'specialties',
      width: 80,
    },
    {
      header: 'Local de atendimento',
      key: 'clinic',
      width: 80,
    },
    {
      header: 'Andar ou observação do local',
      key: 'clinicComplement',
      width: 40,
    },
    {
      header: 'Sobre (descrição)',
      key: 'about',
      width: 120,
    },
    {
      header: 'Links',
      key: 'links',
      width: 120,
    },
    {
      header: 'Observações importantes',
      key: 'importantObservations',
      width: 120,
    },
    {
      header: 'Consultas',
      key: 'consultations',
      width: 120,
    },
    {
      header: 'Atendimento',
      key: 'covenants',
      width: 120,
    },
    {
      header: 'Horários',
      key: 'schedule',
      width: 120,
    },
    {
      header: 'Formas de pagamento',
      key: 'paymentMethod',
      width: 120,
    },
    {
      header: 'Atende crianças',
      key: 'acceptsChildren',
      width: 120,
    },
    {
      header: 'Atende idosos',
      key: 'acceptsElders',
      width: 120,
    },
    {
      header: 'Procedimentos ambulatoriais',
      key: 'outpatientProcedures',
      width: 120,
    },
    {
      header: 'Procedimentos externos',
      key: 'externalProcedures',
      width: 120,
    },
    {
      header: 'Informações adicionais',
      key: 'additionalInformations',
      width: 120,
    },
  ];

  const { data: doctors } = await api.get<any[]>('/doctors');

  await Promise.all(
    doctors.map(async ({ id }) => {
      const { data: doctor } = await api.get(`/doctors/${id}`);

      ['importantObservations', 'additionalInformations'].forEach((key) => {
        doctor[key] = doctor[key].join(',\n');
      });

      ['links'].forEach((key) => {
        doctor[key] = doctor[key]
          .map(({ type, url }) => `${type}: ${url} `)
          .join(' ');
      });

      doctor.gender = doctor.gender === 'M' ? 'Masculino' : 'Feminino';

      ['consultations'].forEach((key) => {
        doctor[key] = doctor[key]
          .map(
            ({ name, price, observation, duration }) =>
              `${name} ${price || ''} ${observation || ''} ${
                duration?.name || ''
              }`
          )
          .join(', ');
      });

      ['covenants'].forEach((key) => {
        doctor[key] = doctor[key]
          .map(
            ({ covenant, observation }) =>
              `${covenant?.name || ''} ${observation || ''}`
          )
          .join(', ');
      });

      ['clinic'].forEach((key) => {
        doctor[key] = doctor[key]?.name || '';
      });

      ['schedule'].forEach((key) => {
        doctor[key] = Array(doctor[key])
          .join(', ')
          .replaceAll('0', 'Domingo')
          .replaceAll('1', 'Segunda')
          .replaceAll('2', 'Terça')
          .replaceAll('3', 'Quarta')
          .replaceAll('4', 'Quinta')
          .replaceAll('5', 'Sexta')
          .replaceAll('6', 'Sábado')
          .replaceAll(':', ' ')
          .replaceAll('AM', 'de manhã')
          .replaceAll('PM', 'a tarde');
      });

      ['specialties'].forEach((key) => {
        doctor[key] = doctor[key].map(({ name }) => name).join(', ');
      });

      ['acceptsChildren', 'acceptsElders'].forEach((key) => {
        doctor[key] = `${doctor[key] ? 'Sim' : 'Não'} ${
          doctor[`${key}Observation`] || ''
        }`;
      });

      ['outpatientProcedures'].forEach((key) => {
        doctor[key] = doctor[key]
          .map(
            ({ procedure, price, duration, observation }) =>
              `${procedure?.name || ''} ${price || ''} ${
                duration?.name || ''
              } ${observation || ''}`
          )
          .join(', ');
      });

      ['externalProcedures'].forEach((key) => {
        doctor[key] = doctor[key].map(({ name }) => name).join(', ');
      });

      const rows: Record<string, string> = {};

      [
        'name',
        'gender',
        'email',
        'council',
        'crm',
        'uf',
        'phone',
        'whatsapp',
        'specialties',
        'clinic',
        'clinicComplement',
        'about',
        'links',
        'importantObservations',
        'consultations',
        'covenants',
        'schedule',
        'paymentMethod',
        'acceptsChildren',
        'acceptsElders',
        'outpatientProcedures',
        'externalProcedures',
        'additionalInformations',
      ].forEach((key) => {
        rows[key] = doctor[key];
      });

      worksheet.addRow(rows);
    })
  );

  await workbook.xlsx.writeFile(`${tmpFolderPath}/Médicos.xlsx`);

  console.info('Done!');
};

export default generateDoctorsExcel;
