import { generateDoctorsExcel, generateUsersExcel } from '~/scripts';

generateUsersExcel().then(() => process.exit(0));
