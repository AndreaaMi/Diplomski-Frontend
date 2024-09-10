export interface SalaryDTO{
   salaryMonth: string;
   baseSalary: number,
   overtimeHours: number,
   holidayWorkHours: number,
   nightShiftHours: number,
   sickLeaveHours: number,
   overtimePayRate: number,
   holidayPayRate: number,
   nightShiftPayRate: number,
   sickLeaveType: string,
   totalSalary: number,
}