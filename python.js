/* SIGNAL — Python 入门课程（中英双语 · 数据驱动渲染）
   内容来源：大学腾飞营2026《Python 系列》课件（基础语法 / 判断循环函数 / 数据容器 / 高阶语法） */

(function () {
  "use strict";

  var PARTS = [
    { no: "Ⅰ", zh: "基础语法", en: "Basics" },
    { no: "Ⅱ", zh: "判断、循环与函数", en: "Control Flow & Functions" },
    { no: "Ⅲ", zh: "数据容器", en: "Data Containers" },
    { no: "Ⅳ", zh: "进阶与面向对象", en: "Advanced & OOP" }
  ];

  var LESSONS = [
    /* ================= PART Ⅰ ================= */
    {
      part: 0,
      no: "01",
      zh: "字面量与数据类型",
      en: "Literals & Data Types",
      hue: 45,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "代码里写下的每个「固定值」都是一种字面量，背后都对应一种数据类型。", en: "Every fixed value written in code is a literal, backed by a data type." },
      blocks: [
        { t: "p", zh: "字面量（Literal）是程序中直接写出的固定值，也就是「常量」——运行过程中不会改变。Python 支持数字、字符串、布尔值等多种字面量。", en: "A literal is a fixed value written directly in the program — a constant that never changes. Python supports numeric, string, boolean and more." },
        { t: "code", code: [
          "# 数字字面量",
          "10",
          "3.14",
          "# 字符串字面量",
          '"Hello World!"',
          "# 布尔字面量",
          "True"
        ].join("\n") },
        { t: "table", label: { zh: "Python 主要内置数据类型", en: "Core built-in types" }, head: [
          { zh: "类型", en: "Type" }, { zh: "说明", en: "Description" }, { zh: "示例", en: "Example" }
        ], rows: [
          [ { zh: "int", en: "int" }, { zh: "整数", en: "Integer" }, { zh: "10, -5", en: "10, -5" } ],
          [ { zh: "float", en: "float" }, { zh: "浮点数", en: "Floating point" }, { zh: "3.14, -0.001", en: "3.14, -0.001" } ],
          [ { zh: "complex", en: "complex" }, { zh: "复数", en: "Complex" }, { zh: "1 + 2j", en: "1 + 2j" } ],
          [ { zh: "str", en: "str" }, { zh: "字符串", en: "String" }, { zh: '"Hello"', en: '"Hello"' } ],
          [ { zh: "list", en: "list" }, { zh: "列表（有序可变集合）", en: "Ordered, mutable" }, { zh: "[1, 2, 3]", en: "[1, 2, 3]" } ],
          [ { zh: "tuple", en: "tuple" }, { zh: "元组（有序不可变集合）", en: "Ordered, immutable" }, { zh: "(1, 2, 3)", en: "(1, 2, 3)" } ],
          [ { zh: "set", en: "set" }, { zh: "集合（无序不重复元素）", en: "Unordered, unique" }, { zh: "{1, 2, 3}", en: "{1, 2, 3}" } ],
          [ { zh: "dict", en: "dict" }, { zh: "字典（键值对集合）", en: "Key-value pairs" }, { zh: '{"name": "Le"}', en: '{"name": "Le"}' } ],
          [ { zh: "bool", en: "bool" }, { zh: "布尔值", en: "Boolean" }, { zh: "True, False", en: "True, False" } ],
          [ { zh: "NoneType", en: "NoneType" }, { zh: "空值 / 无值", en: "No value" }, { zh: "None", en: "None" } ]
        ] },
        { t: "code", label: { zh: "查看类型", en: "Inspecting types" }, code: [
          "print(type(10))   # <class int>",
          'print(type("Hi")) # <class str>',
          "",
          "# isinstance 判断是否为指定类型（或其子类）",
          "print(isinstance(10, int))        # True",
          "print(isinstance(10, (int, float)))  # True"
        ].join("\n") },
        { t: "callout", label: { zh: "两个内置函数", en: "Two built-ins" }, zh: "type() 返回对象的确切类型；isinstance() 返回 True/False，还能一次检查多个类型。后者常用于「先校验再处理」。", en: "type() returns an object's exact type; isinstance() returns True/False and can check several types at once. Use it to validate before processing." }
      ]
    },
    {
      part: 0,
      no: "02",
      zh: "变量与标识符",
      en: "Variables & Identifiers",
      hue: 160,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "变量是给数据贴的「名字」，而给名字起名这件事也有规则。", en: "A variable is a name you attach to data — and naming has rules." },
      blocks: [
        { t: "p", zh: "变量是存储数据的命名位置，值可以随时改变，本身没有固定类型（Python 是动态类型语言）。定义格式：变量名称 = 变量的值。", en: "A variable is a named location storing data; its value can change and it has no fixed type (Python is dynamically typed). Format: name = value." },
        { t: "code", code: [
          "# 定义变量并赋值",
          "x = 10",
          'name = "Alice"',
          "price = 19.99",
          "is_valid = True",
          "",
          "# 变量的值可以随时改变",
          "x = 20"
        ].join("\n") },
        { t: "list", label: { zh: "标识符命名规则", en: "Identifier rules" }, items: [
          { zh: "必须以字母（a-z, A-Z）或下划线（_）开头", en: "Start with a letter or underscore" },
          { zh: "只能出现英文字母、数字、下划线", en: "Only letters, digits, underscores" },
          { zh: "区分大小写：name 和 Name 是两个变量", en: "Case-sensitive: name ≠ Name" },
          { zh: "不能使用 Python 保留关键字（if、for、def、class…）", en: "Cannot use reserved keywords (if, for, def, class…)" }
        ] },
        { t: "terms", label: { zh: "命名规范", en: "Naming conventions" }, items: [
          { name: { zh: "snake_case", en: "snake_case" }, def: { zh: "下划线命名法：first_name、total_price（Python 官方推荐）", en: "Words joined by underscores: first_name, total_price (Python's official style)" } },
          { name: { zh: "camelCase", en: "camelCase" }, def: { zh: "小驼峰：firstName、totalPrice", en: "first word lower, rest capitalized: firstName" } },
          { name: { zh: "PascalCase", en: "PascalCase" }, def: { zh: "大驼峰：FirstName、TotalPrice（常用于类名）", en: "Every word capitalized: FirstName (common for classes)" } }
        ] },
        { t: "callout", label: { zh: "命名追求", en: "Name for clarity" }, zh: "语义化、清晰易懂、尽量简短，并且避免拼音——用英文单词命名，方便国际化与团队协作。", en: "Semantic, clear, concise, and in English — avoid pinyin so your code travels well across teams." }
      ]
    },
    {
      part: 0,
      no: "03",
      zh: "运算符与表达式",
      en: "Operators & Expressions",
      hue: 214,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "运算符是让数据「动起来」的符号，表达式是能算出结果的那段代码。", en: "Operators make data move; expressions are code that evaluates to a value." },
      blocks: [
        { t: "table", label: { zh: "算术运算符", en: "Arithmetic" }, head: [
          { zh: "运算符", en: "Operator" }, { zh: "解释", en: "Meaning" }, { zh: "示例", en: "Example" }
        ], rows: [
          [ { zh: "+", en: "+" }, { zh: "加法", en: "Addition" }, { zh: "5 + 3 → 8", en: "5 + 3 → 8" } ],
          [ { zh: "-", en: "-" }, { zh: "减法", en: "Subtraction" }, { zh: "5 - 3 → 2", en: "5 - 3 → 2" } ],
          [ { zh: "*", en: "*" }, { zh: "乘法", en: "Multiplication" }, { zh: "5 * 3 → 15", en: "5 * 3 → 15" } ],
          [ { zh: "/", en: "/" }, { zh: "除法", en: "Division" }, { zh: "5 / 2 → 2.5", en: "5 / 2 → 2.5" } ],
          [ { zh: "//", en: "//" }, { zh: "取整除（地板除）", en: "Floor division" }, { zh: "5 // 2 → 2", en: "5 // 2 → 2" } ],
          [ { zh: "%", en: "%" }, { zh: "取余（模运算）", en: "Modulo" }, { zh: "5 % 2 → 1", en: "5 % 2 → 1" } ],
          [ { zh: "**", en: "**" }, { zh: "幂运算", en: "Power" }, { zh: "2 ** 3 → 8", en: "2 ** 3 → 8" } ]
        ] },
        { t: "p", zh: "+ 运算符非常「多才多艺」：用于数字是加法，用于字符串是拼接，用于列表是合并。", en: "+ is versatile: addition for numbers, concatenation for strings, merging for lists." },
        { t: "code", code: [
          "# 数值加法",
          "print(5 + 3)   # 8",
          "",
          "# 字符串拼接",
          'print("Hello, " + "World!")   # Hello, World!',
          "",
          "# 列表合并",
          "print([1, 2, 3] + [4, 5, 6])  # [1, 2, 3, 4, 5, 6]"
        ].join("\n") },
        { t: "table", label: { zh: "复合赋值运算符", en: "Compound assignment" }, head: [
          { zh: "运算符", en: "Operator" }, { zh: "解释", en: "Meaning" }
        ], rows: [
          [ { zh: "c += b", en: "c += b" }, { zh: "c = c + b", en: "c = c + b" } ],
          [ { zh: "c -= b", en: "c -= b" }, { zh: "c = c - b", en: "c = c - b" } ],
          [ { zh: "c *= b", en: "c *= b" }, { zh: "c = c * b", en: "c = c * b" } ],
          [ { zh: "c /= b", en: "c /= b" }, { zh: "c = c / b", en: "c = c / b" } ],
          [ { zh: "c //= b", en: "c //= b" }, { zh: "c = c // b", en: "c = c // b" } ],
          [ { zh: "c %= b", en: "c %= b" }, { zh: "c = c % b", en: "c = c % b" } ],
          [ { zh: "c **= b", en: "c **= b" }, { zh: "c = c ** b", en: "c = c ** b" } ]
        ] },
        { t: "p", zh: "表达式是有明确执行结果的代码，计算后会产生一个值。任何能放变量的地方，也能放表达式。", en: "An expression is code that evaluates to a value. Anywhere you can put a variable, you can put an expression." },
        { t: "code", code: [
          "print(5 + 3 * 2)            # 11（先乘后加）",
          "is_greater = 10 > 5         # is_greater 被赋值为 True",
          'length = len("Hello, World!")  # length 被赋值为 13'
        ].join("\n") }
      ]
    },
    {
      part: 0,
      no: "04",
      zh: "字符串精讲",
      en: "Strings in Depth",
      hue: 268,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "单引号、双引号、三引号，再加上 % 占位符和 f-string，字符串的玩法就齐了。", en: "Single, double and triple quotes — plus % formatting and f-strings — cover all string needs." },
      blocks: [
        { t: "terms", label: { zh: "三种定义形式", en: "Three ways to quote" }, items: [
          { name: { zh: "单引号 '…'", en: "Single quotes" }, def: { zh: "定义短小字符串", en: "Short strings" } },
          { name: { zh: "双引号 \"…\"", en: "Double quotes" }, def: { zh: "字符串内包含单引号时，避免转义", en: "Contains single quotes without escaping" } },
          { name: { zh: "三引号 ''' 或 \"\"\"", en: "Triple quotes" }, def: { zh: "多行字符串 / 多行注释，或同时含两种引号", en: "Multi-line strings, or comments" } }
        ] },
        { t: "code", code: [
          "single = 'Hello, World!'",
          'double = "It\'s a beautiful day!"',
          'triple = """This is a',
          "multi-line string.\"\"\"",
          "",
          "# 拼接：+ 与 f-string",
          'name = "Bob"',
          "height = 1.75",
          "print(f\"My name is {name} and height is {height:.2f} m.\")"
        ].join("\n") },
        { t: "p", zh: "拼接字符串除了 + 运算符，还有更优雅的方式：占位符（%）和 f-string。占位符的思路是「我先占个位置，一会儿有变量过来顶替我」。", en: "Beyond +, there are cleaner ways to build strings: % placeholders and f-strings. The % idea: \"I reserve a spot, a variable slides in later.\"" },
        { t: "table", label: { zh: "常用占位符", en: "Common placeholders" }, head: [
          { zh: "占位符", en: "Placeholder" }, { zh: "说明", en: "Meaning" }, { zh: "示例", en: "Example" }
        ], rows: [
          [ { zh: "%s", en: "%s" }, { zh: "字符串", en: "String" }, { zh: '"Hello, %s!" % "World" → Hello, World!', en: '"Hello, %s!" % "World" → Hello, World!' } ],
          [ { zh: "%d", en: "%d" }, { zh: "整数", en: "Integer" }, { zh: '"There are %d apples" % 5', en: '"There are %d apples" % 5' } ],
          [ { zh: "%f", en: "%f" }, { zh: "浮点数", en: "Float" }, { zh: '"Pi is %.2f" % 3.14159 → 3.14', en: '"Pi is %.2f" % 3.14159 → 3.14' } ]
        ] },
        { t: "callout", label: { zh: "m.n 控制宽度与精度", en: "Width & precision" }, zh: "m 控制宽度（数字太宽则失效）；.n 控制小数精度并四舍五入。比如 %.2f 保留两位小数。", en: "m sets width (no effect if smaller than the number); .n sets decimal precision with rounding. E.g. %.2f keeps two decimals." },
        { t: "p", zh: "f-string 是 Python 3.6 之后最简便的写法：直接在字符串里用花括号 {} 嵌入表达式，前面加字母 f。", en: "f-strings (Python 3.6+) are the cleanest: prefix a string with f and embed expressions in braces {}." },
        { t: "code", code: [
          'name = "Bob"',
          "height = 1.75",
          "formatted = f\"My name is {name} and height is {height:.2f} meters.\"",
          "print(formatted)   # My name is Bob and height is 1.75 meters."
        ].join("\n") }
      ]
    },
    {
      part: 0,
      no: "05",
      zh: "缩进与注释",
      en: "Indentation & Comments",
      hue: 25,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "别的语言用大括号圈代码块，Python 用缩进——这是它的标志，也是新手第一道坎。", en: "Other languages use braces for blocks; Python uses indentation — iconic, and a first hurdle." },
      blocks: [
        { t: "p", zh: "Python 不使用大括号 {} 定义代码块，而是靠缩进表示代码块的层次结构与逻辑关系。缩进让代码更简洁易读，但要求非常严格。", en: "Python doesn't use braces; indentation marks block structure. It makes code clean and readable, but the rules are strict." },
        { t: "list", label: { zh: "缩进规则", en: "Indentation rules" }, items: [
          { zh: "空格或制表符（Tab）都可以，但同一代码块只能使用一种", en: "Spaces or tabs, but pick one per block" },
          { zh: "官方建议一个缩进层次使用 4 个空格", en: "The official style uses 4 spaces per level" },
          { zh: "缩进层次必须严格一致，不能混用", en: "Levels must be consistent — no mixing" }
        ] },
        { t: "code", code: [
          "# 正确的缩进",
          "if True:",
          '    print("correct")',
          "    if True:",
          '        print("correct again")',
          "",
          "# 错误的缩进 → IndentationError",
          "if True:",
          '    print("wrong")',
          "      if True:",
          '          print("this will fail")'
        ].join("\n") },
        { t: "p", zh: "相同缩进级别的语句属于同一个代码块；缩进越深，层级越靠内。", en: "Statements at the same indentation belong to the same block; deeper indentation means deeper nesting." },
        { t: "terms", label: { zh: "注释", en: "Comments" }, items: [
          { name: { zh: "单行注释 #", en: "Single-line #" }, def: { zh: "以 # 开头，可独占一行，也可跟在代码后面", en: "Starts with #, alone or after code" } },
          { name: { zh: "多行注释", en: "Multi-line" }, def: { zh: "连续多个 #；或用三引号包起来（本质是多行字符串，不执行）", en: "Consecutive # lines; or a triple-quoted string (not executed)" } }
        ] },
        { t: "code", code: [
          "# 这是单行注释",
          "x = 10  # 行尾注释",
          "",
          "# 多行注释方式一：连续 #",
          "# 每一行都以 # 开头",
          "",
          "# 多行注释方式二：三引号",
          '"""',
          "这是一个多行注释",
          '"""'
        ].join("\n") }
      ]
    },
    {
      part: 0,
      no: "06",
      zh: "判断语句 if / elif / else",
      en: "Conditionals: if / elif / else",
      hue: 330,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "让程序「看情况办事」：条件成立走一条路，否则走另一条。", en: "Make the program branch: if a condition holds, do one thing; otherwise, another." },
      blocks: [
        { t: "p", zh: "判断（条件）语句根据不同的条件执行不同的代码块。三种基本形态：if、if-else、if-elif-else；还可以嵌套使用。", en: "Conditionals run different blocks under different conditions. Three basic forms: if, if-else, if-elif-else; they can also nest." },
        { t: "code", code: [
          "# 基本 if",
          "x = 10",
          "if x > 5:",
          '    print("x is greater than 5")',
          "",
          "# if-else",
          "x = 3",
          "if x > 5:",
          '    print("x > 5")',
          "else:",
          '    print("x <= 5")',
          "",
          "# if-elif-else：多条件择一",
          "x = 7",
          "if x > 10:",
          '    print("x > 10")',
          "elif x > 5:",
          '    print("5 < x <= 10")',
          "else:",
          '    print("x <= 5")'
        ].join("\n") },
        { t: "p", zh: "elif 可以有多个，从上往下依次判断，命中一个就停止；else 兜底。判断也可以嵌套，内层再写一层 if。", en: "You can chain multiple elifs, checked top-down until one matches; else is the fallback. Conditionals can nest." },
        { t: "callout", label: { zh: "嵌套", en: "Nesting" }, zh: "内层缩进更深，属于外层条件成立后的「第二层判断」。注意每个分支的缩进都要对齐。", en: "Inner blocks are indented deeper — a second level of checks once the outer condition holds. Keep each branch aligned." }
      ]
    },

    /* ================= PART Ⅱ ================= */
    {
      part: 1,
      no: "07",
      zh: "逻辑运算符与优先级",
      en: "Logical Operators & Precedence",
      hue: 120,
      tags: [{ zh: "判断", en: "Conditionals" }],
      lead: { zh: "and、or、not 三个词就能把多个条件组合成一个复杂的判断。", en: "and, or, not — three words to combine many conditions into one." },
      blocks: [
        { t: "table", label: { zh: "逻辑运算符", en: "Logical operators" }, head: [
          { zh: "运算符", en: "Operator" }, { zh: "含义", en: "Meaning" }
        ], rows: [
          [ { zh: "and", en: "and" }, { zh: "逻辑「并」：两个都成立才为真", en: "Both must be true" } ],
          [ { zh: "or", en: "or" }, { zh: "逻辑「或」：至少一个成立为真", en: "At least one is true" } ],
          [ { zh: "not", en: "not" }, { zh: "逻辑「非」：取反", en: "Negates the condition" } ]
        ] },
        { t: "code", code: [
          "x = 10",
          "if x > 5 and x < 15:",
          '    print("x is between 5 and 15")',
          "",
          "if x < 5 or x > 10:",
          '    print("x < 5 or x > 10")',
          "",
          "if not x > 10:",
          '    print("x is not greater than 10")'
        ].join("\n") },
        { t: "table", label: { zh: "运算符优先级（从高到低）", en: "Precedence (high → low)" }, head: [
          { zh: "优先级", en: "Level" }, { zh: "运算符", en: "Operators" }
        ], rows: [
          [ { zh: "强制优先级", en: "Forced" }, { zh: "( )", en: "( )" } ],
          [ { zh: "1", en: "1" }, { zh: "算术：+ - * / // % **", en: "Arithmetic: + - * / // % **" } ],
          [ { zh: "2", en: "2" }, { zh: "比较：< <= > >= == !=", en: "Comparison: < <= > >= == !=" } ],
          [ { zh: "3", en: "3" }, { zh: "逻辑：not → and → or", en: "Logical: not → and → or" } ]
        ] },
        { t: "code", code: [
          "x, y, z = 5, 10, 15",
          "# 优先级：() > 算术 > 比较 > 逻辑",
          "if (x + y) * z > 100:",
          '    print("result > 100")'
        ].join("\n") },
        { t: "callout", label: { zh: "建议", en: "Tip" }, zh: "逻辑越复杂，越要记得加括号——括号不仅能强制优先级，还能让读代码的人一眼看懂你的意图。", en: "The more complex the logic, the more you should use parentheses — they force precedence and make intent obvious." }
      ]
    },
    {
      part: 1,
      no: "08",
      zh: "while 循环",
      en: "while Loops",
      hue: 200,
      tags: [{ zh: "循环", en: "Loops" }],
      lead: { zh: "只要条件还成立，就一直重复——这就是 while。", en: "As long as the condition holds, keep repeating — that's while." },
      blocks: [
        { t: "p", zh: "while 循环在满足某个条件时重复执行代码块：先检查条件，为 True 就执行，执行完再检查，直到条件为 False。", en: "while repeats a block while a condition is true: check, run, re-check, until the condition turns false." },
        { t: "code", code: [
          "x = 0",
          "while x < 5:",
          "    print(x)",
          "    x += 1   # 记得让条件往 False 走",
          "",
          "# while 可以嵌套",
          "i = 0",
          "while i < 3:",
          "    j = 0",
          "    while j < 2:",
          "        print(f\"i={i}, j={j}\")",
          "        j += 1",
          "    i += 1"
        ].join("\n") },
        { t: "list", label: { zh: "注意点", en: "Watch out" }, items: [
          { zh: "while 的条件必须是布尔类型（或能转成布尔）", en: "The condition must be boolean (or convertible)" },
          { zh: "务必检查循环出口，避免无限循环——除非你真的想要", en: "Always ensure an exit, or you'll loop forever" }
        ] }
      ]
    },
    {
      part: 1,
      no: "09",
      zh: "for 循环与 range",
      en: "for Loops & range",
      hue: 350,
      tags: [{ zh: "循环", en: "Loops" }],
      lead: { zh: "for 天生就是用来「逛」的：把一个可迭代对象从头到尾走一遍。", en: "for is born to iterate: walk through every element of an iterable." },
      blocks: [
        { t: "p", zh: "for 循环用于遍历序列（列表、元组、字符串等）或任何可迭代对象：每次取一个元素赋给循环变量，执行循环体，直到遍历完。", en: "for iterates sequences (lists, tuples, strings) or any iterable: grab one element at a time into the loop variable, run the body, until done." },
        { t: "code", code: [
          "for i in [1, 2, 3, 4, 5]:",
          "    print(i)",
          "",
          "# 配合 range：生成数字序列",
          "for i in range(5):         # 0 到 4",
          "    print(i)",
          "for i in range(1, 10, 2):  # 1,3,5,7,9",
          "    print(i)",
          "",
          "# 嵌套 for",
          "for i in range(3):",
          "    for j in range(2):",
          "        print(f\"i={i}, j={j}\")"
        ].join("\n") },
        { t: "terms", label: { zh: "range(start, stop, step)", en: "range(start, stop, step)" }, items: [
          { name: { zh: "start", en: "start" }, def: { zh: "起始值，默认 0", en: "Start value, default 0" } },
          { name: { zh: "stop", en: "stop" }, def: { zh: "终止值（不包含该值）", en: "Stop value (exclusive)" } },
          { name: { zh: "step", en: "step" }, def: { zh: "步长，默认 1", en: "Step, default 1" } }
        ] },
        { t: "callout", label: { zh: "临时变量", en: "Loop variable" }, zh: "for 的循环变量原则上只在循环内使用；循环结束后它仍保留最后的值，但规范上不建议在外部访问，容易埋下难查的 bug。", en: "The loop variable is meant for inside the loop; after the loop it keeps its last value, but accessing it outside is discouraged — it hides nasty bugs." }
      ]
    },
    {
      part: 1,
      no: "10",
      zh: "break 与 continue",
      en: "break & continue",
      hue: 285,
      tags: [{ zh: "循环", en: "Loops" }],
      lead: { zh: "循环进行到一半想抽身？break 直接退出，continue 跳过这一步。", en: "Want to bail mid-loop? break exits, continue skips to the next round." },
      blocks: [
        { t: "terms", label: { zh: "两个控制关键字", en: "Two control keywords" }, items: [
          { name: { zh: "break", en: "break" }, def: { zh: "提前退出整个循环（已达到目的 / 遇到错误）", en: "Exit the loop early (goal reached / error)" } },
          { name: { zh: "continue", en: "continue" }, def: { zh: "跳过本次迭代，直接进入下一次", en: "Skip this iteration, move to the next" } }
        ] },
        { t: "code", code: [
          "# break：遇到 5 就退出",
          "for i in range(10):",
          "    if i == 5:",
          "        break",
          "    print(i)   # 0 1 2 3 4",
          "",
          "# continue：跳过偶数",
          "for i in range(10):",
          "    if i % 2 == 0:",
          "        continue",
          "    print(i)   # 1 3 5 7 9"
        ].join("\n") },
        { t: "callout", label: { zh: "作用域", en: "Scope" }, zh: "break 和 continue 只作用于所在的那一层循环。内层的 break 不会停掉外层循环。", en: "break/continue affect only the loop they're in. An inner break won't stop the outer loop." },
        { t: "code", code: [
          "# break 只退出内层循环",
          "for i in range(3):",
          "    for j in range(5):",
          "        if j == 3:",
          "            break",
          "        print(f\"i={i}, j={j}\")"
        ].join("\n") }
      ]
    },
    {
      part: 1,
      no: "11",
      zh: "函数：定义与调用",
      en: "Functions: Define & Call",
      hue: 60,
      tags: [{ zh: "函数", en: "Functions" }],
      lead: { zh: "把一段反复用到的逻辑「打包」成函数，以后一行代码就能调用。", en: "Package reusable logic into a function, then call it with one line." },
      blocks: [
        { t: "p", zh: "函数是执行特定任务的代码块，用 def 关键字定义，支持参数传递和返回值。函数让代码更模块化、可复用。", en: "A function is a block that performs a specific task, defined with def, supporting parameters and return values. Functions make code modular and reusable." },
        { t: "code", code: [
          "def greet(name):",
          '    print(f"Hello, {name}!")',
          "",
          "# 调用函数",
          'greet("Alice")   # Hello, Alice!'
        ].join("\n") },
        { t: "terms", label: { zh: "形参与实参", en: "Parameters & arguments" }, items: [
          { name: { zh: "形参（形式参数）", en: "Parameter" }, def: { zh: "定义函数时使用的参数名称", en: "The name used in the definition" } },
          { name: { zh: "实参（实际参数）", en: "Argument" }, def: { zh: "调用函数时传递给函数的具体值", en: "The concrete value passed when calling" } }
        ] },
        { t: "code", code: [
          "def add(a, b):   # a、b 是形参",
          "    return a + b",
          "",
          "result = add(3, 5)   # 3、5 是实参",
          "print(result)   # 8"
        ].join("\n") }
      ]
    },
    {
      part: 1,
      no: "12",
      zh: "函数的参数与返回值",
      en: "Parameters & Return Values",
      hue: 180,
      tags: [{ zh: "函数", en: "Functions" }],
      lead: { zh: "位置、关键词、默认值，三种传参方式，加上 return 的回传，把函数的姿势补齐。", en: "Positional, keyword and default params — plus return values — round out the function toolbox." },
      blocks: [
        { t: "terms", label: { zh: "三种传参方式", en: "Ways to pass args" }, items: [
          { name: { zh: "位置传参", en: "Positional" }, def: { zh: "按顺序一一对应，不写参数名", en: "Matched by order, no names" } },
          { name: { zh: "关键词传参", en: "Keyword" }, def: { zh: "按参数名传，不依赖顺序，防止混淆", en: "Pass by name, order-independent" } },
          { name: { zh: "默认参数", en: "Default" }, def: { zh: "定义时给参数默认值，调用时可省略", en: "Parameter has a default; call can omit it" } }
        ] },
        { t: "code", code: [
          "def describe_pet(animal_type, pet_name):",
          '    print(f"I have a {animal_type} named {pet_name}.")',
          "",
          'describe_pet("hamster", "Harry")   # 位置传参',
          'describe_pet(pet_name="Whiskers", animal_type="cat")   # 关键词传参',
          "",
          "def greet(name, message=\"Hello\"):",
          '    print(f"{message}, {name}!")',
          "",
          'greet("Alice")        # Hello, Alice!',
          'greet("Bob", "Hi")    # Hi, Bob!'
        ].join("\n") },
        { t: "p", zh: "函数用 return 返回一个值；如果没有 return，默认返回 None。函数还能一次返回多个值——它们会被打包成元组，调用时可用多重赋值解包。", en: "Functions return a value with return; without it, they return None. Functions can also return multiple values — packed as a tuple, unpackable by multiple assignment." },
        { t: "code", code: [
          "def get_coordinates():",
          "    x, y = 10, 20",
          "    return x, y   # 打包成元组",
          "",
          "x_coord, y_coord = get_coordinates()   # 解包",
          "print(x_coord, y_coord)   # 10 20"
        ].join("\n") }
      ]
    },
    {
      part: 1,
      no: "13",
      zh: "高阶用法与作用域",
      en: "Higher-order & Scope",
      hue: 220,
      tags: [{ zh: "函数", en: "Functions" }],
      lead: { zh: "函数也能当参数传、在函数里再定义函数；变量还有局部和全局之分。", en: "Functions can be passed around, defined inside functions, and variables come in local and global flavors." },
      blocks: [
        { t: "p", zh: "函数可以作为参数传给另一个函数，让「回调」和高阶函数成为可能。", en: "Functions can be passed as arguments to other functions — enabling callbacks and higher-order functions." },
        { t: "code", code: [
          "def add(a, b):",
          "    return a + b",
          "",
          "def apply_operation(a, b, operation):",
          "    return operation(a, b)",
          "",
          "print(apply_operation(5, 3, add))   # 8"
        ].join("\n") },
        { t: "terms", label: { zh: "变量作用域", en: "Variable scope" }, items: [
          { name: { zh: "局部变量", en: "Local" }, def: { zh: "函数内部定义，只能在该函数内访问，生命周期随函数结束", en: "Defined inside a function; only visible there" } },
          { name: { zh: "全局变量", en: "Global" }, def: { zh: "函数外部定义，整个脚本可见；函数内用 global 声明才能修改", en: "Visible everywhere; use global to modify inside a function" } }
        ] },
        { t: "code", code: [
          "x = 10   # 全局变量",
          "",
          "def modify_global():",
          "    global x",
          "    x = 5",
          "",
          "modify_global()",
          "print(x)   # 5",
          "",
          "# 嵌套函数：内部函数可访问外部函数的变量",
          "def outer(text):",
          "    def inner():",
          "        print(text)",
          "    inner()",
          "",
          'outer("hi")   # hi'
        ].join("\n") },
        { t: "callout", label: { zh: "函数注释规范", en: "Docstrings" }, zh: "用三引号在函数体第一行写文档字符串（docstring），描述参数与返回值，团队协作和 IDE 提示都会受益。", en: "Write a triple-quoted docstring at the top of the function body describing params and return — your team and IDE will thank you." },
        { t: "code", code: [
          "def add(a, b):",
          "    \"\"\"",
          "    计算两个数的和",
          "",
          "    参数:",
          "        a (int, float): 第一个加数",
          "        b (int, float): 第二个加数",
          "    返回:",
          "        int, float: 两个数的和",
          "    \"\"\"",
          "    return a + b"
        ].join("\n") }
      ]
    },

    /* ================= PART Ⅲ ================= */
    {
      part: 2,
      no: "14",
      zh: "列表 List",
      en: "Lists",
      hue: 140,
      tags: [{ zh: "容器", en: "Containers" }],
      lead: { zh: "一个能装任何东西、还能随时改动的「有序盒子」——列表是 Python 里最常用的容器。", en: "An ordered box that holds anything and changes anytime — the most used container in Python." },
      blocks: [
        { t: "p", zh: "列表是有序的可变数据类型，元素可以是不同类型的数据。三个特点：有序、元素可变、元素可重复。", en: "Lists are ordered, mutable collections whose elements can be any type. Three traits: ordered, mutable, repeatable." },
        { t: "fig", src: "images/python/py-list-index.jpg", alt: "列表下标索引", caption: { zh: "列表通过下标访问：从 0 开始，最后一个元素是 -1。也可以存嵌套列表（列表套列表）。", en: "Lists are accessed by index: starting at 0, with -1 for the last. Lists can also nest lists." } },
        { t: "code", code: [
          "my_list = [1, 2, 3, 4, 5]",
          "print(my_list[0])     # 1",
          "print(my_list[-1])    # 5",
          "my_list[1] = 25       # 修改元素",
          "print(my_list)        # [1, 25, 3, 4, 5]"
        ].join("\n") },
        { t: "table", label: { zh: "常用操作", en: "Common operations" }, head: [
          { zh: "操作", en: "Operation" }, { zh: "写法", en: "Syntax" }
        ], rows: [
          [ { zh: "查找元素下标", en: "Find index" }, { zh: "my_list.index(20)", en: "my_list.index(20)" } ],
          [ { zh: "统计元素数量", en: "Count" }, { zh: "my_list.count(10)", en: "my_list.count(10)" } ],
          [ { zh: "元素个数", en: "Length" }, { zh: "len(my_list)", en: "len(my_list)" } ],
          [ { zh: "指定位置插入", en: "Insert" }, { zh: "my_list.insert(2, 35)", en: "my_list.insert(2, 35)" } ],
          [ { zh: "追加元素", en: "Append" }, { zh: "my_list.append(60)", en: "my_list.append(60)" } ],
          [ { zh: "追加多个元素", en: "Extend" }, { zh: "my_list.extend([70, 80])", en: "my_list.extend([70, 80])" } ],
          [ { zh: "删除第一个匹配", en: "Remove" }, { zh: "my_list.remove(30)", en: "my_list.remove(30)" } ],
          [ { zh: "按下标删除并返回", en: "Pop" }, { zh: "my_list.pop(1)", en: "my_list.pop(1)" } ],
          [ { zh: "按下标删除", en: "Delete" }, { zh: "del my_list[2]", en: "del my_list[2]" } ],
          [ { zh: "清空列表", en: "Clear" }, { zh: "my_list.clear()", en: "my_list.clear()" } ],
          [ { zh: "列表拼接", en: "Concatenate" }, { zh: "my_list + [60, 70]", en: "my_list + [60, 70]" } ],
          [ { zh: "检查是否包含", en: "Contains" }, { zh: "20 in my_list", en: "20 in my_list" } ]
        ] },
        { t: "p", zh: "遍历列表：while 需要手动管理下标 i；for 更简洁，直接逐个取出元素；也可以结合 range 遍历下标。", en: "Iterate a list: while needs manual index i; for is cleaner, yielding elements directly; or use range to walk indices." },
        { t: "code", code: [
          "my_list = [10, 20, 30, 40, 50]",
          "",
          "for element in my_list:",
          "    print(element)",
          "",
          "for i in range(len(my_list)):",
          "    print(f\"Index {i}: {my_list[i]}\")"
        ].join("\n") }
      ]
    },
    {
      part: 2,
      no: "15",
      zh: "元组 Tuple",
      en: "Tuples",
      hue: 270,
      tags: [{ zh: "容器", en: "Containers" }],
      lead: { zh: "和列表长得很像，但一旦创建就不能改——用来存「不该变」的数据。", en: "Looks like a list, but immutable once created — for data that shouldn't change." },
      blocks: [
        { t: "p", zh: "元组是有序、不可变的数据结构：创建后不能修改、添加或删除元素。三个特点：有序、元素不可变、元素可重复。", en: "Tuples are ordered and immutable: after creation, no modify/add/delete. Three traits: ordered, immutable, repeatable." },
        { t: "code", code: [
          "empty = ()",
          "my_tuple = (1, 2, 3, 4, 5)",
          "mixed = (1, \"hello\", 3.14, True)",
          "no_paren = 1, 2, 3      # 不带括号也能定义",
          "single = (1,)           # 单元素必须加逗号",
          "",
          "print(my_tuple[0])    # 1",
          "print(my_tuple[-1])   # 5"
        ].join("\n") },
        { t: "callout", label: { zh: "不可变", en: "Immutable" }, zh: "尝试修改元组元素会抛 TypeError。这是特性不是缺点：不可变的数据更安全，还能做字典的键、集合的元素。", en: "Trying to change a tuple raises TypeError. That's a feature: immutable data is safer and can be dict keys / set elements." },
        { t: "table", label: { zh: "常用操作", en: "Common operations" }, head: [
          { zh: "操作", en: "Operation" }, { zh: "写法", en: "Syntax" }
        ], rows: [
          [ { zh: "访问元素", en: "Access" }, { zh: "my_tuple[1]", en: "my_tuple[1]" } ],
          [ { zh: "查找下标", en: "Find index" }, { zh: "my_tuple.index(20)", en: "my_tuple.index(20)" } ],
          [ { zh: "统计数量", en: "Count" }, { zh: "my_tuple.count(10)", en: "my_tuple.count(10)" } ],
          [ { zh: "元组长度", en: "Length" }, { zh: "len(my_tuple)", en: "len(my_tuple)" } ],
          [ { zh: "元组拼接", en: "Concatenate" }, { zh: "my_tuple + (60, 70)", en: "my_tuple + (60, 70)" } ],
          [ { zh: "检查包含", en: "Contains" }, { zh: "20 in my_tuple", en: "20 in my_tuple" } ]
        ] },
        { t: "p", zh: "元组解包：把元组元素一次性赋给多个变量；配合 * 还能只解包部分元素。", en: "Tuple unpacking assigns elements to several variables at once; * captures the rest as a list." },
        { t: "code", code: [
          "my_tuple = (10, 20, 30)",
          "a, b, c = my_tuple",
          "print(a, b, c)   # 10 20 30",
          "",
          "t = (10, 20, 30, 40, 50)",
          "a, *b, c = t",
          "print(a)   # 10",
          "print(b)   # [20, 30, 40]",
          "print(c)   # 50"
        ].join("\n") }
      ]
    },
    {
      part: 2,
      no: "16",
      zh: "字符串操作与切片",
      en: "String Ops & Slicing",
      hue: 350,
      tags: [{ zh: "容器", en: "Containers" }],
      lead: { zh: "字符串本质是「字符的容器」，和列表、元组同属序列，都能用下标、切片。", en: "Strings are character containers — a sequence like lists and tuples, supporting indices and slicing." },
      blocks: [
        { t: "p", zh: "字符串有下标索引，但与元组一样不可变——要修改只能创建新字符串。三个特点：有序、元素不可变、元素可重复。", en: "Strings support indices but are immutable like tuples — modifying means creating a new string. Three traits: ordered, immutable, repeatable." },
        { t: "table", label: { zh: "常用操作", en: "Common operations" }, head: [
          { zh: "操作", en: "Operation" }, { zh: "写法", en: "Syntax" }
        ], rows: [
          [ { zh: "查找字符下标", en: "Find index" }, { zh: "s.index('a')", en: "s.index('a')" } ],
          [ { zh: "统计字符数量", en: "Count" }, { zh: "s.count('a')", en: "s.count('a')" } ],
          [ { zh: "字符串长度", en: "Length" }, { zh: "len(s)", en: "len(s)" } ],
          [ { zh: "字符替换", en: "Replace" }, { zh: "s.replace('a', 'b')", en: "s.replace('a', 'b')" } ],
          [ { zh: "字符串分割", en: "Split" }, { zh: "s.split(',')", en: "s.split(',')" } ],
          [ { zh: "去除首尾空白", en: "Strip" }, { zh: "s.strip()", en: "s.strip()" } ]
        ] },
        { t: "code", code: [
          's = " hello, world! "',
          "print(s.index('o'))        # 5",
          "print(s.count('l'))        # 3",
          "print(len(s))              # 14",
          'print(s.replace("world", "Python"))  # 替换',
          'print(s.split(","))        # [" hello", " world! "]',
          "print(s.strip())           # 去首尾空白"
        ].join("\n") },
        { t: "p", zh: "列表、字符串、元组本质上都是序列（sequence）：内容连续有序、可用下标访问、可迭代（for）、支持切片。", en: "Lists, strings and tuples are all sequences: contiguous and ordered, indexable, iterable, and sliceable." },
        { t: "fig", src: "images/python/py-slice.jpg", alt: "序列切片示意", caption: { zh: "切片从序列中取出一个子序列：子序列 = 序列[start:stop:step]。口诀：前取后不取，步长正负决定取值顺序。", en: "Slicing extracts a subsequence: seq[start:stop:step]. Mnemonic: take start, stop before stop, and step's sign sets the direction." } },
        { t: "code", code: [
          "seq = [0, 1, 2, 3, 4, 5]",
          "print(seq[1:4])    # [1, 2, 3]",
          "print(seq[:3])     # [0, 1, 2]",
          "print(seq[::2])    # [0, 2, 4]",
          "print(seq[::-1])   # [5, 4, 3, 2, 1, 0]",
          "",
          "# 字符串同样可以切片",
          'print("hello"[1:4])   # ell'
        ].join("\n") }
      ]
    },
    {
      part: 2,
      no: "17",
      zh: "集合 Set",
      en: "Sets",
      hue: 35,
      tags: [{ zh: "容器", en: "Containers" }],
      lead: { zh: "把重复项自动去掉，还支持并集、交集、差集——集合是处理「去重」和「关系」的神器。", en: "Auto-dedupe, plus union/intersection/difference — sets are the tool for uniqueness and relationships." },
      blocks: [
        { t: "p", zh: "集合用于存储不重复的元素，是无序的，因此无法用下标访问。三个特点：无序、元素可变、元素不可重复。", en: "Sets store unique elements and are unordered — no index access. Three traits: unordered, mutable, non-repeatable." },
        { t: "table", label: { zh: "常用操作", en: "Common operations" }, head: [
          { zh: "操作", en: "Operation" }, { zh: "写法", en: "Syntax" }
        ], rows: [
          [ { zh: "创建集合", en: "Create" }, { zh: "set() 或 {1, 2, 3}", en: "set() or {1, 2, 3}" } ],
          [ { zh: "添加元素", en: "Add" }, { zh: "my_set.add(4)", en: "my_set.add(4)" } ],
          [ { zh: "移除元素", en: "Remove" }, { zh: "my_set.remove(2) 或 .discard(2)", en: "my_set.remove(2) or .discard(2)" } ],
          [ { zh: "清空集合", en: "Clear" }, { zh: "my_set.clear()", en: "my_set.clear()" } ],
          [ { zh: "集合大小", en: "Size" }, { zh: "len(my_set)", en: "len(my_set)" } ],
          [ { zh: "检查包含", en: "Contains" }, { zh: "3 in my_set", en: "3 in my_set" } ]
        ] },
        { t: "table", label: { zh: "集合运算", en: "Set operations" }, head: [
          { zh: "运算", en: "Operation" }, { zh: "方法", en: "Method" }, { zh: "运算符", en: "Operator" }
        ], rows: [
          [ { zh: "并集", en: "Union" }, { zh: "set1.union(set2)", en: "set1.union(set2)" }, { zh: "set1 | set2", en: "set1 | set2" } ],
          [ { zh: "交集", en: "Intersection" }, { zh: "set1.intersection(set2)", en: "set1.intersection(set2)" }, { zh: "set1 & set2", en: "set1 & set2" } ],
          [ { zh: "差集", en: "Difference" }, { zh: "set1.difference(set2)", en: "set1.difference(set2)" }, { zh: "set1 - set2", en: "set1 - set2" } ]
        ] },
        { t: "code", code: [
          "set1 = {1, 2, 3, 4}",
          "set2 = {3, 4, 5, 6}",
          "",
          "print(set1 | set2)   # 并集 {1, 2, 3, 4, 5, 6}",
          "print(set1 & set2)   # 交集 {3, 4}",
          "print(set1 - set2)   # 差集 {1, 2}"
        ].join("\n") },
        { t: "callout", label: { zh: "遍历", en: "Iteration" }, zh: "集合无序、没有下标，不能用 while 遍历；用 for 循环即可，但元素顺序不保证。", en: "Sets are unordered with no indices — while can't iterate them, but for works (order not guaranteed)." }
      ]
    },
    {
      part: 2,
      no: "18",
      zh: "字典 Dict",
      en: "Dictionaries",
      hue: 190,
      tags: [{ zh: "容器", en: "Containers" }],
      lead: { zh: "字典不是按顺序排队，而是按「名字」查「值」——键值对的天下。", en: "Dicts don't queue in order; they look up values by name — key-value pairs rule." },
      blocks: [
        { t: "p", zh: "字典是键值对（key-value）的无序集合，每个键唯一，键值之间用冒号分隔。四个特点：键值对形式、无序、元素可变、键不可重复。", en: "A dict is an unordered collection of key-value pairs with unique keys, separated by colons. Four traits: pairs, unordered, mutable, unique keys." },
        { t: "code", code: [
          'my_dict = {"name": "Alice", "age": 25, "city": "New York"}',
          "",
          "print(my_dict[\"name\"])    # Alice",
          "my_dict[\"age\"] = 26       # 修改",
          'my_dict["country"] = "USA"  # 新增',
          "del my_dict[\"city\"]       # 删除键值对",
          "",
          "for key, value in my_dict.items():",
          "    print(f\"{key}: {value}\")"
        ].join("\n") },
        { t: "table", label: { zh: "常用操作", en: "Common operations" }, head: [
          { zh: "操作", en: "Operation" }, { zh: "写法", en: "Syntax" }
        ], rows: [
          [ { zh: "获取值", en: "Get value" }, { zh: "my_dict[\"name\"]", en: "my_dict[\"name\"]" } ],
          [ { zh: "添加 / 修改键值对", en: "Add / update" }, { zh: "my_dict[\"age\"] = 26", en: "my_dict[\"age\"] = 26" } ],
          [ { zh: "删除键值对", en: "Delete" }, { zh: "del my_dict[\"city\"]", en: "del my_dict[\"city\"]" } ],
          [ { zh: "获取所有键", en: "All keys" }, { zh: "my_dict.keys()", en: "my_dict.keys()" } ],
          [ { zh: "获取所有值", en: "All values" }, { zh: "my_dict.values()", en: "my_dict.values()" } ],
          [ { zh: "获取所有键值对", en: "All items" }, { zh: "my_dict.items()", en: "my_dict.items()" } ],
          [ { zh: "检查键是否存在", en: "Contains key" }, { zh: "'name' in my_dict", en: "'name' in my_dict" } ],
          [ { zh: "带默认值的取值", en: "Get w/ default" }, { zh: "my_dict.get(\"name\", \"Unknown\")", en: "my_dict.get(\"name\", \"Unknown\")" } ],
          [ { zh: "删除并返回值", en: "Pop" }, { zh: "my_dict.pop(\"age\", \"Not Found\")", en: "my_dict.pop(\"age\", \"Not Found\")" } ],
          [ { zh: "合并另一个字典", en: "Update" }, { zh: "my_dict.update({\"country\": \"USA\"})", en: "my_dict.update({\"country\": \"USA\"})" } ],
          [ { zh: "清空字典", en: "Clear" }, { zh: "my_dict.clear()", en: "my_dict.clear()" } ]
        ] },
        { t: "callout", label: { zh: "get vs 下标", en: "get vs brackets" }, zh: "用下标访问不存在的键会直接 KeyError；用 get(key, default) 则返回默认值，更适合「可能不存在」的场景。", en: "Bracket access to a missing key raises KeyError; get(key, default) returns a fallback — safer for optional keys." }
      ]
    },
    {
      part: 2,
      no: "19",
      zh: "容器总结",
      en: "Containers at a Glance",
      hue: 90,
      tags: [{ zh: "容器", en: "Containers" }],
      lead: { zh: "五个容器，一张表对照完：能不能改、能不能重复、有没有序、怎么取数。", en: "Five containers, one comparison table: mutable? repeatable? ordered? how to access?" },
      blocks: [
        { t: "table", label: { zh: "五大容器对比", en: "Five containers compared" }, head: [
          { zh: "容器", en: "Container" }, { zh: "下标索引", en: "Index" }, { zh: "可重复", en: "Repeatable" }, { zh: "可修改", en: "Mutable" }, { zh: "有序", en: "Ordered" }, { zh: "典型场景", en: "Typical use" }
        ], rows: [
          [ { zh: "列表 list []", en: "list []" }, { zh: "支持", en: "Yes" }, { zh: "可重复", en: "Yes" }, { zh: "可修改", en: "Yes" }, { zh: "有序", en: "Yes" }, { zh: "需要改动的有序数据", en: "Ordered, editable data" } ],
          [ { zh: "元组 tuple ()", en: "tuple ()" }, { zh: "支持", en: "Yes" }, { zh: "可重复", en: "Yes" }, { zh: "不可修改", en: "No" }, { zh: "有序", en: "Yes" }, { zh: "固定不变的打包数据", en: "Fixed bundles" } ],
          [ { zh: "字符串 str", en: "str" }, { zh: "支持", en: "Yes" }, { zh: "可重复", en: "Yes" }, { zh: "不可修改", en: "No" }, { zh: "有序", en: "Yes" }, { zh: "文本", en: "Text" } ],
          [ { zh: "集合 set {}", en: "set {}" }, { zh: "不支持", en: "No" }, { zh: "不可重复", en: "No" }, { zh: "可修改", en: "Yes" }, { zh: "无序", en: "No" }, { zh: "去重、集合运算", en: "Uniqueness, set ops" } ],
          [ { zh: "字典 dict {}", en: "dict {}" }, { zh: "不支持", en: "No" }, { zh: "键不可重复", en: "Keys unique" }, { zh: "可修改", en: "Yes" }, { zh: "无序", en: "No" }, { zh: "用 key 记 value", en: "Lookup by key" } ]
        ] },
        { t: "table", label: { zh: "通用函数", en: "Universal functions" }, head: [
          { zh: "函数", en: "Function" }, { zh: "作用", en: "Purpose" }
        ], rows: [
          [ { zh: "len() / max() / min()", en: "len() / max() / min()" }, { zh: "长度 / 最大值 / 最小值", en: "Length / max / min" } ],
          [ { zh: "list() / tuple() / str() / set()", en: "list() / tuple() / str() / set()" }, { zh: "类型转换", en: "Type conversion" } ],
          [ { zh: "sorted()", en: "sorted()" }, { zh: "排序（返回新对象）", en: "Sort (returns a new object)" } ],
          [ { zh: "for 循环", en: "for loop" }, { zh: "五种容器都支持 for 遍历", en: "All five work with for" } ]
        ] },
        { t: "callout", label: { zh: "怎么选？", en: "How to choose?" }, zh: "要下标、要顺序 → list / tuple / str；只去重、要集合运算 → set；要按名取值 → dict；怕数据被改 → tuple / str。", en: "Need index & order → list / tuple / str; dedupe & set ops → set; lookups by name → dict; protect from edits → tuple / str." }
      ]
    },

    /* ================= PART Ⅳ ================= */
    {
      part: 3,
      no: "20",
      zh: "异常捕获",
      en: "Exception Handling",
      hue: 15,
      tags: [{ zh: "进阶", en: "Advanced" }],
      lead: { zh: "bug 一定会出现。与其让程序崩掉，不如提前写好「如果出错了怎么办」。", en: "Bugs happen. Instead of crashing, prepare: \"if this fails, do that.\"" },
      blocks: [
        { t: "p", zh: "异常（Exception）就是我们常说的 bug，可能来自语法错误（如括号没关）或运行时错误（如除零、访问不存在的变量）。异常出现后，可以提前写异常捕获，提示并继续执行。", en: "An exception is a bug: a syntax error (e.g. an unclosed paren) or a runtime error (e.g. dividing by zero). With handlers, we can report and keep going." },
        { t: "code", code: [
          "try:",
          "    # 可能发生异常的代码",
          "    value = int(input(\"请输入一个整数: \"))",
          "except ValueError:",
          '    print("输入的不是有效整数")',
          "except Exception as e:",
          '    print(f"其他错误: {e}")'
        ].join("\n") },
        { t: "table", label: { zh: "常见异常类型", en: "Common exception types" }, head: [
          { zh: "异常", en: "Exception" }, { zh: "触发场景", en: "When it fires" }
        ], rows: [
          [ { zh: "IndexError", en: "IndexError" }, { zh: "序列索引超出范围", en: "Sequence index out of range" } ],
          [ { zh: "KeyError", en: "KeyError" }, { zh: "访问不存在的字典键", en: "Accessing a missing dict key" } ],
          [ { zh: "NameError", en: "NameError" }, { zh: "访问未声明的变量", en: "Using an undeclared variable" } ],
          [ { zh: "ValueError", en: "ValueError" }, { zh: "类型正确但值不合法", en: "Right type, invalid value" } ],
          [ { zh: "SyntaxError", en: "SyntaxError" }, { zh: "Python 语法错误", en: "Python syntax is wrong" } ],
          [ { zh: "ImportError", en: "ImportError" }, { zh: "导入模块失败", en: "Module import failed" } ],
          [ { zh: "KeyboardInterrupt", en: "KeyboardInterrupt" }, { zh: "用户按 Ctrl+C 中断", en: "User pressed Ctrl+C" } ],
          [ { zh: "EOFError", en: "EOFError" }, { zh: "input() 没读到数据", en: "input() got no data" } ]
        ] },
        { t: "p", zh: "except 后可以写具体异常类型；写 Exception 则「捕获所有异常」。完整语法还包含 else（无异常时执行）和 finally（无论是否异常都执行）。", en: "except names a specific type, or catches all with Exception. The full form adds else (runs when no exception) and finally (always runs)." },
        { t: "code", code: [
          "try:",
          '    value = int(input("请输入一个整数: "))',
          "except ValueError as e:",
          '    print(f"输入错误: {e}")',
          "else:",
          '    print("输入有效")',
          "finally:",
          '    print("结束")'
        ].join("\n") },
        { t: "p", zh: "异常有传递性：函数内部抛出的异常若未处理，会一路传递到调用它的代码里处理。", en: "Exceptions propagate: one thrown inside a function and left unhandled bubbles up to the caller." },
        { t: "code", code: [
          "def func1():",
          "    return 1 / 0   # ZeroDivisionError",
          "",
          "def func2():",
          "    try:",
          "        func1()",
          "    except ZeroDivisionError as e:",
          '        print(f"在 func2 中捕获: {e}")',
          "",
          "func2()   # 在 func2 中捕获: division by zero"
        ].join("\n") }
      ]
    },
    {
      part: 3,
      no: "21",
      zh: "类与对象",
      en: "Classes & Objects",
      hue: 240,
      tags: [{ zh: "进阶", en: "Advanced" }],
      lead: { zh: "类是一张「蓝图」，对象是按蓝图造出来的「实例」——面向对象编程的核心。", en: "A class is a blueprint; an object is an instance built from it — the heart of OOP." },
      blocks: [
        { t: "p", zh: "Python 是面向对象的语言。类是对象的蓝图/模板，对象是类的实例。类里的变量叫属性，函数叫方法，两者统称成员。", en: "Python is object-oriented. A class is a blueprint; an object is an instance. Variables in a class are attributes, functions are methods — together, members." },
        { t: "code", code: [
          "class Person:",
          '    species = "Homo sapiens"  # 类属性',
          "",
          "    def __init__(self, name, age):",
          "        self.name = name",
          "        self.age = age",
          "",
          "    def greet(self):   # 第一个参数必须是 self",
          '        print(f"Hello, my name is {self.name}.")',
          "",
          'person = Person("Alice", 30)',
          "print(person.name)    # Alice",
          "person.greet()        # Hello, my name is Alice."
        ].join("\n") },
        { t: "terms", label: { zh: "两个关键概念", en: "Two key ideas" }, items: [
          { name: { zh: "构造方法 __init__", en: "__init__" }, def: { zh: "创建对象时自动调用，用来初始化属性", en: "Auto-called on creation to set up attributes" } },
          { name: { zh: "self", en: "self" }, def: { zh: "方法第一个参数，代表实例自身，调用时忽略", en: "The instance itself; first param, omitted at call" } }
        ] },
        { t: "p", zh: "魔术方法（双下划线方法）让类支持内建操作：__add__ 定义 +、__len__ 定义 len()、__getitem__ 定义下标访问等。", en: "Magic (dunder) methods wire a class into built-in operations: __add__ for +, __len__ for len(), __getitem__ for indexing, etc." },
        { t: "code", code: [
          "class Vector:",
          "    def __init__(self, x, y):",
          "        self.x = x",
          "        self.y = y",
          "",
          "    def __add__(self, other):",
          "        return Vector(self.x + other.x, self.y + other.y)",
          "",
          "    def __eq__(self, other):",
          "        return self.x == other.x and self.y == other.y",
          "",
          "v1 = Vector(2, 3)",
          "v2 = Vector(1, 1)",
          "v3 = v1 + v2",
          "print(v3.x, v3.y)   # 3 4",
          "print(v1 == v2)     # False"
        ].join("\n") },
        { t: "terms", label: { zh: "封装 / 继承 / 多继承", en: "Encapsulation & inheritance" }, items: [
          { name: { zh: "封装", en: "Encapsulation" }, def: { zh: "私有属性/方法前加双下划线 __，外部无法直接访问，只能通过公开方法", en: "Prefix members with __ to hide them; access via public methods" } },
          { name: { zh: "继承", en: "Inheritance" }, def: { zh: "class Dog(Animal) 继承父类属性和方法，实现代码复用", en: "class Dog(Animal) inherits members for reuse" } },
          { name: { zh: "多继承", en: "Multiple inheritance" }, def: { zh: "一个类继承多个类，如 class RoboDog(Dog, Robot)", en: "One class inherits from several, e.g. RoboDog(Dog, Robot)" } }
        ] },
        { t: "code", code: [
          "class Animal:",
          "    def __init__(self, name):",
          "        self.name = name",
          "",
          "    def speak(self):",
          "        pass",
          "",
          "class Dog(Animal):",
          '    def speak(self):',
          '        return "Woof!"',
          "",
          "class Robot:",
          '    def operate(self):',
          '        return "I am a robot."',
          "",
          "# 多继承",
          "class RoboDog(Dog, Robot):",
          "    def __init__(self, name):",
          "        Dog.__init__(self, name)",
          "        Robot.__init__(self)",
          "",
          'robo = RoboDog("Rex")',
          "print(robo.speak())    # Woof!",
          "print(robo.operate())  # I am a robot."
        ].join("\n") },
        { t: "callout", label: { zh: "私有成员", en: "Private members" }, zh: "类的私有成员不会被继承，但可以通过父类的公开方法间接访问到它们。", en: "Private members aren't inherited, but can still be reached through the parent's public methods." }
      ]
    },
    {
      part: 3,
      no: "22",
      zh: "模块与库",
      en: "Modules & Libraries",
      hue: 320,
      tags: [{ zh: "进阶", en: "Advanced" }],
      lead: { zh: "把自己的代码写进 .py 文件就是模块，把多个模块装进带 __init__.py 的文件夹就是库。", en: "A .py file is a module; a folder of modules with __init__.py is a library." },
      blocks: [
        { t: "p", zh: "模块是包含 Python 定义和语句的文件（.py），通过 import 在其他文件里使用。", en: "A module is a .py file of Python definitions; import it for use elsewhere." },
        { t: "code", label: { zh: "创建模块并导入", en: "Create & import" }, code: [
          "# mymodule.py",
          "def greet(name):",
          '    print(f"Hello, {name}!")',
          "",
          "PI = 3.14159",
          "",
          "# main.py",
          "import mymodule",
          'mymodule.greet("Alice")   # Hello, Alice!',
          "",
          "from mymodule import greet, PI",
          "greet(\"Bob\")",
          "",
          "import mymodule as mm",
          "mm.greet(\"Charlie\")"
        ].join("\n") },
        { t: "p", zh: "库由多个模块组成，目录里需要一个 __init__.py（可为空）表示这是一个 Python 包。", en: "A library groups modules; its folder holds __init__.py (can be empty) marking it a package." },
        { t: "code", code: [
          "# my_library/ 目录结构",
          "#   __init__.py",
          "#   module1.py",
          "#   module2.py",
          "",
          "# __init__.py 内容",
          "from .module1 import function1",
          "from .module2 import function2",
          "",
          "# main.py",
          "import my_library",
          "my_library.function1()",
          "my_library.function2()"
        ].join("\n") },
        { t: "table", label: { zh: "常用标准库", en: "Common stdlib" }, head: [
          { zh: "模块", en: "Module" }, { zh: "用途", en: "Purpose" }
        ], rows: [
          [ { zh: "os / sys", en: "os / sys" }, { zh: "操作系统交互 / 解释器相关", en: "OS interaction / interpreter" } ],
          [ { zh: "math", en: "math" }, { zh: "数学函数", en: "Math functions" } ],
          [ { zh: "datetime", en: "datetime" }, { zh: "日期与时间", en: "Dates and time" } ],
          [ { zh: "json", en: "json" }, { zh: "JSON 解析与生成", en: "JSON parse & generate" } ],
          [ { zh: "re", en: "re" }, { zh: "正则表达式", en: "Regular expressions" } ],
          [ { zh: "random", en: "random" }, { zh: "生成随机数", en: "Random numbers" } ],
          [ { zh: "collections", en: "collections" }, { zh: "高级数据结构", en: "Advanced data structures" } ]
        ] },
        { t: "table", label: { zh: "常用第三方库", en: "Popular third-party libs" }, head: [
          { zh: "库", en: "Lib" }, { zh: "用途", en: "Purpose" }
        ], rows: [
          [ { zh: "requests", en: "requests" }, { zh: "HTTP 请求", en: "HTTP requests" } ],
          [ { zh: "numpy / pandas", en: "numpy / pandas" }, { zh: "数组矩阵运算 / 数据分析", en: "Arrays & matrices / data analysis" } ],
          [ { zh: "matplotlib", en: "matplotlib" }, { zh: "绘图可视化", en: "Plotting & visualization" } ],
          [ { zh: "scipy", en: "scipy" }, { zh: "科学计算", en: "Scientific computing" } ],
          [ { zh: "flask", en: "flask" }, { zh: "Web 微框架", en: "Web micro-framework" } ],
          [ { zh: "beautifulsoup4", en: "beautifulsoup4" }, { zh: "HTML/XML 解析", en: "HTML/XML parsing" } ]
        ] },
        { t: "p", zh: "第三方库用 pip 安装：pip install requests。安装后即可 import 使用，Python 生态的威力就在于此。", en: "Install third-party libs with pip: pip install requests. Then just import — the power of the Python ecosystem." },
        { t: "code", code: [
          "import requests",
          "",
          "response = requests.get('https://api.github.com')",
          "print(response.status_code)   # 200",
          "print(response.json())        # API 返回的 JSON 数据"
        ].join("\n") }
      ]
    }
  ];

  /* ===================== 渲染 ===================== */

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : s;
    return d.innerHTML;
  }

  function isEn() { return window.SIGNAL_LANG === "en"; }
  function T(s) { return window.t ? window.t(s) : s; }
  function pick(o) { return isEn() ? (o.en || o.zh) : o.zh; }

  function iconBolt() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>';
  }

  /* ---------- 轻量 Python 语法高亮（正则分词，无依赖） ---------- */

  var PY_KEYWORDS = ("and as assert async await break class continue def del elif else " +
    "except finally for from global if import in is lambda match case nonlocal not or " +
    "pass raise return try while with yield True False None").split(" ").join("|");

  var PY_BUILTINS = ("abs all any bool bytes dict enumerate filter float format frozenset " +
    "input int isinstance len list map max min open ord print range repr reversed round " +
    "set slice sorted str sum tuple type zip").split(" ").join("|");

  var TOKEN_RE = new RegExp(
    "(f?\"\"\"[\\s\\S]*?\"\"\"|f?'''[\\s\\S]*?'''|f?\"(?:\\\\.|[^\"\\\\\\n])*\"|f?'(?:\\\\.|[^'\\\\\\n])*')" +
    "|(#[^\\n]*)" +
    "|(@[A-Za-z_]\\w*)" +
    "|(\\b\\d+(?:\\.\\d+)?\\b)" +
    "|(\\b(?:" + PY_KEYWORDS + ")\\b)" +
    "|(\\b(?:" + PY_BUILTINS + ")\\b)",
    "g"
  );

  function pyHighlight(code) {
    var out = "";
    var last = 0;
    var m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
      out += code.slice(last, m.index);
      var cls;
      if (m[1]) cls = "tok-s";
      else if (m[2]) cls = "tok-c";
      else if (m[3]) cls = "tok-d";
      else if (m[4]) cls = "tok-n";
      else if (m[5]) cls = "tok-k";
      else cls = "tok-b";
      out += '<span class="' + cls + '">' + m[0] + "</span>";
      last = TOKEN_RE.lastIndex;
    }
    out += code.slice(last);
    return out;
  }

  if (typeof window !== "undefined") window.SIGNAL_HL = pyHighlight;

  function renderBlock(b, hue) {
    switch (b.t) {
      case "p":
        return '<p class="l-p">' + esc(pick(b)) + "</p>";
      case "sub":
        return "<h3 class=\"l-sub\">" + esc(pick(b)) + "</h3>";
      case "list":
        return (
          "<div class=\"l-block\">" +
            (b.label ? '<div class="l-block-label">' + esc(pick(b.label)) + "</div>" : "") +
            '<ul class="l-list">' +
              b.items.map(function (i) { return "<li>" + esc(pick(i)) + "</li>"; }).join("") +
            "</ul>" +
          "</div>"
        );
      case "terms":
        return (
          "<div class=\"l-block\">" +
            (b.label ? '<div class="l-block-label">' + esc(pick(b.label)) + "</div>" : "") +
            '<dl class="l-terms">' +
              b.items.map(function (it) {
                return '<div class="l-term"><dt>' + esc(pick(it.name)) + "</dt><dd>" + esc(pick(it.def)) + "</dd></div>";
              }).join("") +
            "</dl>" +
          "</div>"
        );
      case "table":
        return (
          "<div class=\"l-block\">" +
            (b.label ? '<div class="l-block-label">' + esc(pick(b.label)) + "</div>" : "") +
            '<div class="lg-wrap"><table class="lg-table">' +
              "<thead><tr>" + b.head.map(function (h) { return "<th>" + esc(pick(h)) + "</th>"; }).join("") + "</tr></thead>" +
              "<tbody>" + b.rows.map(function (r) {
                return "<tr>" + r.map(function (c) { return "<td>" + esc(pick(c)) + "</td>"; }).join("") + "</tr>";
              }).join("") + "</tbody>" +
            "</table></div>" +
          "</div>"
        );
      case "code":
        return (
          "<div class=\"l-block\">" +
            (b.label ? '<div class="l-block-label">' + esc(pick(b.label)) + "</div>" : "") +
            '<pre class="l-code" style="--lh:' + hue + '">' +
              '<button type="button" class="l-code-copy" aria-label="' + esc(T("复制代码")) + '">' + esc(T("复制")) + "</button>" +
              "<code>" + pyHighlight(esc(b.code)) + "</code>" +
            "</pre>" +
          "</div>"
        );
      case "callout":
        return (
          '<aside class="l-callout" style="--lh:' + hue + '">' +
            '<div class="l-callout-head">' + iconBolt() + '<span>' + esc(pick(b.label)) + "</span></div>" +
            '<div class="l-callout-body"><p>' + esc(pick(b)) + "</p></div>" +
          "</aside>"
        );
      case "fig":
        return (
          '<figure class="l-fig" style="--lh:' + hue + '">' +
            '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || "") + '" loading="lazy">' +
            "<figcaption>" + esc(pick(b.caption)) +
              '<span class="l-fig-credit">' + (isEn() ? "Source: course slides" : "来源：课程课件") + "</span>" +
            "</figcaption>" +
          "</figure>"
        );
    }
    return "";
  }

  function renderLesson(l, idx) {
    var prev = LESSONS[idx - 1];
    var divider = !prev || prev.part !== l.part
      ? '<div class="lesson-part" id="part-' + l.part + '">' +
          '<span class="lesson-part-no">' + esc(PARTS[l.part].no) + "</span>" +
          "<h2>" + esc(isEn() ? PARTS[l.part].en : PARTS[l.part].zh) + "</h2>" +
        "</div>"
      : "";
    return (
      divider +
      '<article class="lesson" id="' + esc("c" + l.no) + '" style="--lh:' + l.hue + '">' +
        '<header class="lesson-head">' +
          '<span class="lesson-no" aria-hidden="true">' + esc(l.no) + "</span>" +
          '<div class="lesson-head-main">' +
            "<h2 class=\"lesson-title\">" + esc(isEn() ? l.en : l.zh) + "</h2>" +
            '<p class="lesson-lead">' + esc(pick(l.lead)) + "</p>" +
            '<div class="lesson-tags">' +
              (l.tags || []).map(function (tag) { return "<span>" + esc(pick(tag)) + "</span>"; }).join("") +
            "</div>" +
          "</div>" +
        "</header>" +
        '<div class="lesson-body">' +
          l.blocks.map(function (b) { return renderBlock(b, l.hue); }).join("") +
        "</div>" +
        renderPager(idx) +
      "</article>"
    );
  }

  function renderNav() {
    var nav = document.getElementById("tut-nav");
    if (!nav) return;
    var html = "";
    PARTS.forEach(function (p, pi) {
      var lessons = LESSONS.filter(function (l) { return l.part === pi; });
      if (!lessons.length) return;
      html += '<div class="tut-nav-group">' +
        "<h4>" + esc(p.no) + " · " + esc(isEn() ? p.en : p.zh) + "</h4>";
      html += lessons.map(function (l) {
        return '<a href="#c' + esc(l.no) + '" data-lid="' + esc("c" + l.no) + '">' +
          '<span class="tut-no">' + esc(l.no) + "</span>" +
          esc(isEn() ? l.en : l.zh) +
        "</a>";
      }).join("");
      html += "</div>";
    });
    nav.innerHTML = html;
  }

  function pagerBtn(idx, label, dir) {
    var l = LESSONS[idx];
    if (!l) return '<span class="lp-btn off"></span>';
    return '<a class="lp-btn' + (dir === "right" ? " right" : "") + '" href="#c' + esc(l.no) + '">' +
      '<span class="lp-dir">' + esc(T(label)) + "</span>" +
      '<span class="lp-name">' + esc(l.no) + " · " + esc(isEn() ? l.en : l.zh) + "</span>" +
    "</a>";
  }

  function renderPager(idx) {
    return '<nav class="lesson-pager" aria-label="' + (isEn() ? "Chapter navigation" : "课程导航") + '">' +
      pagerBtn(idx - 1, "上一章") +
      pagerBtn(idx + 1, "下一章", "right") +
    "</nav>";
  }

  function headerOffset() {
    var h = document.querySelector(".site-header");
    return h ? h.offsetHeight : 0;
  }

  function updateSpy() {
    var nav = document.getElementById("tut-nav");
    var links = nav ? nav.querySelectorAll("a") : [];
    if (!links.length) return;
    var offset = headerOffset() + 24;
    var current = LESSONS[0];
    for (var i = 0; i < LESSONS.length; i++) {
      var el = document.getElementById("c" + LESSONS[i].no);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= offset) current = LESSONS[i];
      else break;
    }
    var lid = "c" + current.no;
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle("active", links[j].getAttribute("data-lid") === lid);
    }
    var cur = document.getElementById("crumb-cur");
    if (cur) cur.textContent = isEn() ? "Lesson " + current.no : "第 " + current.no + " 章";
  }

  var spyTimer = null;
  function onScroll() {
    if (spyTimer) return;
    spyTimer = window.requestAnimationFrame(function () {
      spyTimer = null;
      updateSpy();
    });
  }

  function renderAll() {
    var toc = document.getElementById("lesson-toc");
    if (toc) {
      var html = "";
      PARTS.forEach(function (p, pi) {
        var lessons = LESSONS.filter(function (l) { return l.part === pi; });
        if (!lessons.length) return;
        html += '<span class="lesson-toc-part">' + esc(isEn() ? p.en : p.zh) + "</span>";
        html += lessons.map(function (l) {
          return '<a href="#c' + esc(l.no) + '"><span class="toc-no">' + esc(l.no) + "</span>" + esc(isEn() ? l.en : l.zh) + "</a>";
        }).join("");
      });
      toc.innerHTML = html;
    }
    renderNav();
    var ls = document.getElementById("lessons");
    if (ls) ls.innerHTML = LESSONS.map(renderLesson).join("");
    updateSpy();
  }

  document.addEventListener("DOMContentLoaded", renderAll);
  document.addEventListener("signal:lang", renderAll);
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 复制代码 ---------- */

  function copyFallback(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    done(ok);
  }

  function handleCopy(e) {
    var btn = e.target && e.target.closest ? e.target.closest(".l-code-copy") : null;
    if (!btn || !btn.parentNode) return;
    var code = btn.parentNode.querySelector("code");
    if (!code) return;
    var text = code.textContent;
    var done = function (ok) {
      if (!ok) { btn.textContent = T("复制失败"); btn.classList.add("done"); return; }
      btn.textContent = T("已复制");
      btn.classList.add("done");
      setTimeout(function () {
        btn.textContent = T("复制");
        btn.classList.remove("done");
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { copyFallback(text, done); });
    } else {
      copyFallback(text, done);
    }
  }

  document.addEventListener("click", handleCopy);
})();
