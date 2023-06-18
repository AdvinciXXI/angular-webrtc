export class User {
  public room: String; // set your room name
  public name: String; // set your room name

  constructor(room: String, name: String) {
    this.room = room;
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setName(name: String) {
    this.name = name;
  }
}
