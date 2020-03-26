export interface IPatinentDetails {
  name: string;
  birthDate: string;
  gender: string;
}

export class PatientDetails implements IPatinentDetails {
  /**
   *
   */
  constructor(name: string, gender: string, birthDate: string) {
    this.name = name;
    this.gender = gender;
    this.birthDate = birthDate;
  }

  public name: string;
  public birthDate: string;
  public gender: string;
}
