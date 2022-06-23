{
    console.log("1");
    var INTEGER_1 = "INTEGER";
    var PLUS_1 = "PLUS";
    var MINUS_1 = "MINUS";
    var EOF_1 = "EOF";
    var WHITESPACE_1 = " ";
    var NONE_1 = null;
    var isdigit_1 = function (value) {
        return Number.isInteger(Number(value));
    };
    var Token_1 = /** @class */ (function () {
        function Token(type, value) {
            this.type = type;
            this.value = value;
        }
        Token.prototype.toString = function () {
            var _a = this, type = _a.type, value = _a.value;
            return "Type: " + type + ", Value:" + value;
        };
        return Token;
    }());
    var Interpreter = /** @class */ (function () {
        function Interpreter(text) {
            this.pos = 0;
            this.text = text;
            this.pos = 0;
            this.current_token = NONE_1;
            this.current_char = this.text[this.pos];
        }
        Interpreter.prototype.error = function () {
            throw new Error("Error parsing input");
        };
        /**
         * Advance the 'pos' pointer and set the 'current_char' variable.
         */
        Interpreter.prototype.advance = function () {
            this.pos += 1;
            if (this.pos > this.text.length) {
                this.current_char = NONE_1;
            }
            else {
                this.current_char = this.text[this.pos];
            }
        };
        Interpreter.prototype.skip_whitespace = function () {
            while (this.current_char !== NONE_1 && this.current_char === WHITESPACE_1) {
                this.advance();
            }
        };
        /**
         * Return a (multidigit) integer consumed from the input.
         */
        Interpreter.prototype.integer = function () {
            var result = 0;
            while (this.current_char !== NONE_1 && isdigit_1(this.current_char)) {
                result += Number(this.current_char);
                this.advance();
            }
            return result;
        };
        /**
         * Lexical analyzer (also known as scanner or tokenizer)
         * This method is responsible for breaking a sentence
         * apart into tokens.
         */
        Interpreter.prototype.get_next_token = function () {
            var current_char = this.current_char;
            while (current_char !== NONE_1) {
                if (current_char === WHITESPACE_1) {
                    this.skip_whitespace();
                    continue;
                }
                if (isdigit_1(current_char)) {
                    return new Token_1(INTEGER_1, this.integer());
                }
                if (current_char === "+") {
                    this.advance();
                    return new Token_1(PLUS_1, "+");
                }
                if (current_char === "-") {
                    this.advance();
                    return new Token_1(MINUS_1, "-");
                }
                this.error();
            }
            return new Token_1(EOF_1, NONE_1);
        };
        Interpreter.prototype.eat = function (type) {
            if (this.current_token.type === type) {
                this.current_token = this.get_next_token();
            }
            else {
                this.error();
            }
        };
        /**
         * Parser / Interpreter
         * expr -> INTEGER PLUS INTEGER
         * expr -> INTEGER MINUS INTEGER
         */
        Interpreter.prototype.expr = function () {
            /**set current token to the first token taken from the input */
            this.current_token = this.get_next_token();
            /**we expect the current token to be an integer */
            var left = this.current_token;
            this.eat(INTEGER_1);
            /**we expect the current token to be either a '+' or '-' */
            var op = this.current_token;
            if (op.type === PLUS_1) {
                this.eat(PLUS_1);
            }
            else {
                this.eat(MINUS_1);
            }
            /**we expect the current token to be an integer */
            var right = this.current_token;
            this.eat(INTEGER_1);
            /**
             * after the above call the self.current_token is set to
             * EOF token
             * at this point either the INTEGER PLUS INTEGER or
             * the INTEGER MINUS INTEGER sequence of tokens
             * has been successfully found and the method can just
             * return the result of adding or subtracting two integers,
             * thus effectively interpreting client input
             */
            var result;
            if (op.type == PLUS_1) {
                result = left.value + right.value;
            }
            else {
                result = left.value - right.value;
            }
            return result;
        };
        return Interpreter;
    }());
    console.log("start interpretering");
    var interpreter = new Interpreter("1+2");
    console.log(interpreter.expr());
}
