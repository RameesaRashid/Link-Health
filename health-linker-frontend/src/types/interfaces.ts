
export interface IDoctor {
  _id: string;
  name: string;
  specialty: string;
  fees: number;
}

export interface IAvailableSlot {
  _id: string;
  doctorId: IDoctor;
  startTime: string;
  endTime: string;   
  date: string;     
}

export interface IAppointment {
    _id: string;
    patientId: string;
    doctorId: IDoctor; 
    slotId: string;
    startTime: Date;
    endTime: Date;
    status: 'Confirmed' | 'Cancelled' | 'Pending'; 
    reason: string;
}