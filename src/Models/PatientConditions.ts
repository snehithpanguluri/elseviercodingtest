export class Condition {
  /**
   *
   */
  constructor(name: string, dateofrecord: string, searchlink: string) {
    this.name = name;
    this.dateofrecord = dateofrecord;
    this.searchlink = searchlink;
  }

  public name: string;
  public dateofrecord: string;
  public searchlink: string;
}
