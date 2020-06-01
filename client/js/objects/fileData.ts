import Node from "./node";

export default class FileData {
  index: number = 0;
  input: Node[][] = [];
  answers: string[] = [];

  constructor(index: number, input: Node[][], answers: string[]) {
    this.index = index;
    this.input = input;
    this.answers = answers;
  }

  getNode(index1: number = 0, index2: number) {
    return this.input[index1][index2];
  }

  getInputNames(ix: number) {
    var inputNames = [];
    this.input[ix].forEach((el) => {
      inputNames.push(el.name);
    });
    return inputNames;
  }

  getInput() {
    return this.input;
  }

  getInputFlat() {
    var inputNames = [];
    this.input.forEach((el) => {
      el.forEach((e) => inputNames.push(e));
    });
    return inputNames;
  }

  getAnswers() {
    return this.answers;
  }

  toJSON() {
    var out = new Array();
    var data = new Array();
    this.input.forEach((i) => {
        var d = new Array();
        i.forEach((i1) => {
            d.push(i1.toJSON());
        });
        data.push(d);
    });
    out.push({input: data, answers: this.answers});
    return out;
  }
}
