{
  console.log("1");
  const INTEGER = "INTEGER";

  const PLUS = "PLUS";
  const MINUS = "MINUS";

  const EOF = "EOF";

  const WHITESPACE = " ";
  const NONE = null;

  const isdigit = (value: string | number): boolean => {
    return Number.isInteger(Number(value));
  };

  class Token {
    public type: string;
    public value: string | number;
    constructor(type, value) {
      this.type = type;
      this.value = value;
    }

    toString(): String {
      const { type, value } = this;
      return `Type: ${type}, Value:${value}`;
    }
  }

  class Interpreter {
    private text: string;
    private pos: number = 0;
    private current_token: Token;
    private current_char: string | number;
    constructor(text) {
      this.text = text;
      this.pos = 0;
      this.current_token = NONE;
      this.current_char = this.text[this.pos];
    }

    private error(): Error {
      throw new Error("Error parsing input");
    }

    /**
     * Advance the 'pos' pointer and set the 'current_char' variable.
     */
    private advance(): void {
      this.pos += 1;
      if (this.pos > this.text.length) {
        this.current_char = NONE;
      } else {
        this.current_char = this.text[this.pos];
      }
    }

    private skip_whitespace(): void {
      while (this.current_char !== NONE && this.current_char === WHITESPACE) {
        this.advance();
      }
    }

    /**
     * Return a (multidigit) integer consumed from the input.
     */
    private integer(): number {
      let result: number = 0;
      while (this.current_char !== NONE && isdigit(this.current_char)) {
        result += Number(this.current_char);
        this.advance();
      }
      return result;
    }

    /**
     * Lexical analyzer (also known as scanner or tokenizer)
     * This method is responsible for breaking a sentence
     * apart into tokens.
     */
    private get_next_token(): Token {
      const current_char = this.current_char;
      while (current_char !== NONE) {
        if (current_char === WHITESPACE) {
          this.skip_whitespace();
          continue;
        }

        if (isdigit(current_char)) {
          return new Token(INTEGER, this.integer());
        }

        if (current_char === "+") {
          this.advance();
          return new Token(PLUS, "+");
        }

        if (current_char === "-") {
          this.advance();
          return new Token(MINUS, "-");
        }

        this.error();
      }
      return new Token(EOF, NONE);
    }

    private eat(type): void {
      if (this.current_token.type === type) {
        this.current_token = this.get_next_token();
      } else {
        this.error();
      }
    }

    /**
     * Parser / Interpreter
     * expr -> INTEGER PLUS INTEGER
     * expr -> INTEGER MINUS INTEGER
     */
    public expr() {
      /**set current token to the first token taken from the input */
      this.current_token = this.get_next_token();

      /**we expect the current token to be an integer */
      const left: any = this.current_token;
      this.eat(INTEGER);

      /**we expect the current token to be either a '+' or '-' */
      const op = this.current_token;
      if (op.type === PLUS) {
        this.eat(PLUS);
      } else {
        this.eat(MINUS);
      }

      /**we expect the current token to be an integer */
      const right: any = this.current_token;
      this.eat(INTEGER);

      /**
       * after the above call the self.current_token is set to
       * EOF token
       * at this point either the INTEGER PLUS INTEGER or
       * the INTEGER MINUS INTEGER sequence of tokens
       * has been successfully found and the method can just
       * return the result of adding or subtracting two integers,
       * thus effectively interpreting client input
       */
      let result;
      if (op.type == PLUS) {
        result = left.value + right.value;
      } else {
        result = left.value - right.value;
      }
      return result;
    }
  }
  console.log("start interpretering");
  const interpreter = new Interpreter("1+2");
  console.log(interpreter.expr());
}
