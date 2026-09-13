export const ROADMAP_DATA = [
  {
    id: "javascript-fundamentals",
    number: "1",
    title: "JavaScript Fundamentals",
    icon: "FaJs",
    color: "text-amber-500 bg-amber-50 border-amber-200",
    badgeText: "JS",
    sections: [
      {
        id: "javascript-basics",
        number: "1.1",
        title: "JavaScript Basics",
        topics: [
          {
            id: "js-basics-variables",
            number: "1.1.1",
            title: "Variables",
            subtopics: [
              { id: "js-basics-variables-var", title: "var" },
              { id: "js-basics-variables-let", title: "let" },
              { id: "js-basics-variables-const", title: "const" }
            ]
          },
          {
            id: "js-basics-data-types",
            number: "1.1.2",
            title: "Data Types",
            subtopics: [
              { id: "js-basics-dt-primitive", title: "Primitive" },
              { id: "js-basics-dt-non-primitive", title: "Non-primitive" }
            ]
          },
          { id: "js-basics-type-conversion", number: "1.1.3", title: "Type Conversion" },
          { id: "js-basics-type-coercion", number: "1.1.4", title: "Type Coercion" },
          { id: "js-basics-loose-vs-strict", number: "1.1.5", title: "== vs ===" },
          { id: "js-basics-truthy-falsy", number: "1.1.6", title: "Truthy and Falsy Values" },
          { id: "js-basics-null", number: "1.1.7", title: "null" },
          { id: "js-basics-undefined", number: "1.1.8", title: "undefined" },
          { id: "js-basics-nan", number: "1.1.9", title: "NaN" }
        ]
      },
      {
        id: "scope",
        number: "1.2",
        title: "Scope",
        topics: [
          { id: "scope-global", number: "1.2.1", title: "Global Scope" },
          { id: "scope-function", number: "1.2.2", title: "Function Scope" },
          { id: "scope-block", number: "1.2.3", title: "Block Scope" },
          { id: "scope-lexical", number: "1.2.4", title: "Lexical Scope" },
          { id: "scope-chain", number: "1.2.5", title: "Scope Chain" }
        ]
      },
      {
        id: "hoisting",
        number: "1.3",
        title: "Hoisting",
        topics: [
          { id: "hoisting-variable", number: "1.3.1", title: "Variable Hoisting" },
          { id: "hoisting-function", number: "1.3.2", title: "Function Hoisting" },
          { id: "hoisting-var", number: "1.3.3", title: "var Hoisting" },
          { id: "hoisting-let-const-tdz", number: "1.3.4", title: "let / const and Temporal Dead Zone" }
        ]
      },
      {
        id: "execution-context",
        number: "1.4",
        title: "Execution Context",
        topics: [
          { id: "exec-context-global", number: "1.4.1", title: "Global Execution Context" },
          { id: "exec-context-function", number: "1.4.2", title: "Function Execution Context" },
          { id: "exec-context-creation", number: "1.4.3", title: "Creation Phase" },
          { id: "exec-context-execution", number: "1.4.4", title: "Execution Phase" },
          { id: "exec-context-lexical-env", number: "1.4.5", title: "Lexical Environment" },
          { id: "exec-context-variable-env", number: "1.4.6", title: "Variable Environment" }
        ]
      },
      {
        id: "call-stack",
        number: "1.5",
        title: "Call Stack",
        topics: [
          { id: "call-stack-frames", number: "1.5.1", title: "Stack Frames" },
          { id: "call-stack-execution", number: "1.5.2", title: "Function Execution" },
          { id: "call-stack-overflow", number: "1.5.3", title: "Stack Overflow" }
        ]
      }
    ]
  },
  {
    id: "javascript-functions",
    number: "2",
    title: "JavaScript Functions",
    icon: "FaCode",
    color: "text-blue-500 bg-blue-50 border-blue-200",
    badgeText: "FN",
    sections: [
      {
        id: "functions",
        number: "2.1",
        title: "Functions",
        topics: [
          { id: "fn-declaration", number: "2.1.1", title: "Function Declaration" },
          { id: "fn-expression", number: "2.1.2", title: "Function Expression" },
          { id: "fn-anonymous", number: "2.1.3", title: "Anonymous Functions" },
          { id: "fn-higher-order", number: "2.1.4", title: "Higher-Order Functions" },
          { id: "fn-first-class", number: "2.1.5", title: "First-Class Functions" },
          { id: "fn-callback", number: "2.1.6", title: "Callback Functions" }
        ]
      },
      {
        id: "arrow-functions",
        number: "2.2",
        title: "Arrow Functions",
        topics: [
          { id: "arrow-syntax", number: "2.2.1", title: "Arrow Function Syntax" },
          { id: "arrow-vs-regular", number: "2.2.2", title: "Arrow Functions vs Regular Functions" },
          { id: "arrow-and-this", number: "2.2.3", title: "Arrow Functions and this" }
        ]
      },
      {
        id: "closures",
        number: "2.3",
        title: "Closures",
        topics: [
          { id: "closures-lexical-env", number: "2.3.1", title: "Lexical Environment" },
          { id: "closures-creation", number: "2.3.2", title: "Closure Creation" },
          { id: "closures-practical-uses", number: "2.3.3", title: "Practical Uses of Closures" },
          { id: "closures-data-privacy", number: "2.3.4", title: "Closures and Data Privacy" }
        ]
      },
      {
        id: "this-keyword",
        number: "2.4",
        title: "this Keyword",
        topics: [
          { id: "this-global", number: "2.4.1", title: "this in Global Context" },
          { id: "this-regular-functions", number: "2.4.2", title: "this in Regular Functions" },
          { id: "this-objects", number: "2.4.3", title: "this in Objects" },
          { id: "this-arrow-functions", number: "2.4.4", title: "this in Arrow Functions" },
          { id: "this-classes", number: "2.4.5", title: "this in Classes" }
        ]
      },
      {
        id: "call-apply-bind",
        number: "2.5",
        title: "call, apply, bind",
        topics: [
          { id: "cab-call", number: "2.5.1", title: "call()" },
          { id: "cab-apply", number: "2.5.2", title: "apply()" },
          { id: "cab-bind", number: "2.5.3", title: "bind()" },
          { id: "cab-differences", number: "2.5.4", title: "Differences Between call, apply, and bind" }
        ]
      }
    ]
  },
  {
    id: "javascript-objects-prototypes",
    number: "3",
    title: "JavaScript Objects & Prototypes",
    icon: "FaCubes",
    color: "text-purple-500 bg-purple-50 border-purple-200",
    badgeText: "OBJ",
    sections: [
      {
        id: "objects",
        number: "3.1",
        title: "Objects",
        topics: [
          { id: "obj-creation", number: "3.1.1", title: "Object Creation" },
          { id: "obj-properties", number: "3.1.2", title: "Object Properties" },
          { id: "obj-methods", number: "3.1.3", title: "Object Methods" },
          { id: "obj-destructuring", number: "3.1.4", title: "Object Destructuring" }
        ]
      },
      {
        id: "prototype",
        number: "3.2",
        title: "Prototype",
        topics: [
          { id: "proto-prototype", number: "3.2.1", title: "Prototype" },
          { id: "proto-chain", number: "3.2.2", title: "Prototype Chain" },
          { id: "proto-inheritance", number: "3.2.3", title: "Prototypal Inheritance" },
          { id: "proto-prop", number: "3.2.4", title: "prototype" },
          { id: "proto-dunder", number: "3.2.5", title: "__proto__" }
        ]
      },
      {
        id: "classes",
        number: "3.3",
        title: "Classes",
        topics: [
          { id: "classes-definition", number: "3.3.1", title: "Classes" },
          { id: "classes-constructor", number: "3.3.2", title: "Constructor" },
          { id: "classes-methods", number: "3.3.3", title: "Methods" },
          { id: "classes-inheritance", number: "3.3.4", title: "Inheritance" },
          { id: "classes-extends", number: "3.3.5", title: "extends" },
          { id: "classes-super", number: "3.3.6", title: "super" }
        ]
      }
    ]
  },
  {
    id: "es6-plus-javascript",
    number: "4",
    title: "ES6+ JavaScript",
    icon: "FaBolt",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    badgeText: "ES6",
    sections: [
      {
        id: "es6-features",
        number: "4.1",
        title: "ES6+ Features",
        topics: [
          { id: "es6-template-literals", number: "4.1.1", title: "Template Literals" },
          {
            id: "es6-destructuring",
            number: "4.1.2",
            title: "Destructuring",
            subtopics: [
              { id: "es6-destruct-object", title: "Object Destructuring" },
              { id: "es6-destruct-array", title: "Array Destructuring" }
            ]
          },
          { id: "es6-spread-operator", number: "4.1.3", title: "Spread Operator" },
          { id: "es6-rest-operator", number: "4.1.4", title: "Rest Operator" },
          { id: "es6-default-parameters", number: "4.1.5", title: "Default Parameters" },
          { id: "es6-optional-chaining", number: "4.1.6", title: "Optional Chaining" },
          { id: "es6-nullish-coalescing", number: "4.1.7", title: "Nullish Coalescing" },
          {
            id: "es6-modules",
            number: "4.1.8",
            title: "Modules",
            subtopics: [
              { id: "es6-mod-import", title: "import" },
              { id: "es6-mod-export", title: "export" },
              { id: "es6-mod-export-default", title: "export default" }
            ]
          },
          { id: "es6-dynamic-import", number: "4.1.9", title: "Dynamic import()" }
        ]
      }
    ]
  },
  {
    id: "javascript-arrays-collections",
    number: "5",
    title: "JavaScript Arrays & Collections",
    icon: "FaLayerGroup",
    color: "text-emerald-500 bg-emerald-50 border-emerald-200",
    badgeText: "ARR",
    sections: [
      {
        id: "array-methods",
        number: "5.1",
        title: "Array Methods",
        topics: [
          { id: "arr-foreach", number: "5.1.1", title: "forEach()" },
          { id: "arr-map", number: "5.1.2", title: "map()" },
          { id: "arr-filter", number: "5.1.3", title: "filter()" },
          { id: "arr-reduce", number: "5.1.4", title: "reduce()" },
          { id: "arr-find", number: "5.1.5", title: "find()" },
          { id: "arr-findindex", number: "5.1.6", title: "findIndex()" },
          { id: "arr-some", number: "5.1.7", title: "some()" },
          { id: "arr-every", number: "5.1.8", title: "every()" },
          { id: "arr-includes", number: "5.1.9", title: "includes()" },
          { id: "arr-sort", number: "5.1.10", title: "sort()" },
          { id: "arr-slice", number: "5.1.11", title: "slice()" },
          { id: "arr-splice", number: "5.1.12", title: "splice()" }
        ]
      },
      {
        id: "collections",
        number: "5.2",
        title: "Collections",
        topics: [
          { id: "coll-object", number: "5.2.1", title: "Object" },
          { id: "coll-array", number: "5.2.2", title: "Array" },
          { id: "coll-map", number: "5.2.3", title: "Map" },
          { id: "coll-set", number: "5.2.4", title: "Set" },
          { id: "coll-weakmap", number: "5.2.5", title: "WeakMap" },
          { id: "coll-weakset", number: "5.2.6", title: "WeakSet" }
        ]
      },
      {
        id: "copying-data",
        number: "5.3",
        title: "Copying Data",
        topics: [
          { id: "copy-ref-vs-val", number: "5.3.1", title: "Reference vs Value" },
          { id: "copy-shallow", number: "5.3.2", title: "Shallow Copy" },
          { id: "copy-deep", number: "5.3.3", title: "Deep Copy" },
          { id: "copy-immutable-ops", number: "5.3.4", title: "Immutable Operations" },
          { id: "copy-structured-clone", number: "5.3.5", title: "structuredClone()" }
        ]
      }
    ]
  },
  {
    id: "javascript-asynchronous-programming",
    number: "6",
    title: "JavaScript Asynchronous Programming",
    icon: "FaClock",
    color: "text-cyan-500 bg-cyan-50 border-cyan-200",
    badgeText: "ASYNC",
    sections: [
      {
        id: "callback",
        number: "6.1",
        title: "Callback",
        topics: [
          { id: "async-callback-functions", number: "6.1.1", title: "Callback Functions" },
          { id: "async-callback-hell", number: "6.1.2", title: "Callback Hell" }
        ]
      },
      {
        id: "event-loop",
        number: "6.2",
        title: "Event Loop",
        topics: [
          { id: "event-loop-call-stack", number: "6.2.1", title: "Call Stack" },
          { id: "event-loop-web-apis", number: "6.2.2", title: "Web APIs" },
          { id: "event-loop-callback-queue", number: "6.2.3", title: "Callback Queue" },
          { id: "event-loop-microtask-queue", number: "6.2.4", title: "Microtask Queue" },
          { id: "event-loop-macrotask-queue", number: "6.2.5", title: "Macrotask Queue" },
          { id: "event-loop-execution-order", number: "6.2.6", title: "Event Loop Execution Order" }
        ]
      },
      {
        id: "promises",
        number: "6.3",
        title: "Promises",
        topics: [
          { id: "promises-def", number: "6.3.1", title: "Promise" },
          { id: "promises-states", number: "6.3.2", title: "Promise States" },
          { id: "promises-resolve", number: "6.3.3", title: "resolve" },
          { id: "promises-reject", number: "6.3.4", title: "reject" },
          { id: "promises-then", number: "6.3.5", title: ".then()" },
          { id: "promises-catch", number: "6.3.6", title: ".catch()" },
          { id: "promises-finally", number: "6.3.7", title: ".finally()" },
          { id: "promises-chaining", number: "6.3.8", title: "Promise Chaining" }
        ]
      },
      {
        id: "promise-methods",
        number: "6.4",
        title: "Promise Methods",
        topics: [
          { id: "promise-method-all", number: "6.4.1", title: "Promise.all()" },
          { id: "promise-method-all-settled", number: "6.4.2", title: "Promise.allSettled()" },
          { id: "promise-method-race", number: "6.4.3", title: "Promise.race()" },
          { id: "promise-method-any", number: "6.4.4", title: "Promise.any()" }
        ]
      },
      {
        id: "async-await",
        number: "6.5",
        title: "Async/Await",
        topics: [
          { id: "async-keyword", number: "6.5.1", title: "async" },
          { id: "await-keyword", number: "6.5.2", title: "await" },
          { id: "async-error-handling", number: "6.5.3", title: "Error Handling" },
          { id: "async-sequential", number: "6.5.4", title: "Sequential Execution" },
          { id: "async-parallel", number: "6.5.5", title: "Parallel Execution" }
        ]
      },
      {
        id: "error-handling",
        number: "6.6",
        title: "Error Handling",
        topics: [
          { id: "err-try", number: "6.6.1", title: "try" },
          { id: "err-catch", number: "6.6.2", title: "catch" },
          { id: "err-finally", number: "6.6.3", title: "finally" },
          { id: "err-throw", number: "6.6.4", title: "throw" },
          { id: "err-promise", number: "6.6.5", title: "Promise Error Handling" },
          { id: "err-async-await", number: "6.6.6", title: "Async/Await Error Handling" }
        ]
      }
    ]
  },
  {
    id: "browser-web-fundamentals",
    number: "7",
    title: "Browser & Web Fundamentals",
    icon: "FaGlobe",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    badgeText: "WEB",
    sections: [
      {
        id: "dom",
        number: "7.1",
        title: "DOM",
        topics: [
          { id: "dom-def", number: "7.1.1", title: "DOM" },
          { id: "dom-tree", number: "7.1.2", title: "DOM Tree" },
          { id: "dom-manipulation", number: "7.1.3", title: "DOM Manipulation" },
          { id: "dom-events", number: "7.1.4", title: "DOM Events" }
        ]
      },
      {
        id: "bom",
        number: "7.2",
        title: "BOM",
        topics: [
          { id: "bom-def", number: "7.2.1", title: "Browser Object Model" },
          { id: "bom-window", number: "7.2.2", title: "window" },
          { id: "bom-location", number: "7.2.3", title: "location" },
          { id: "bom-history", number: "7.2.4", title: "history" },
          { id: "bom-navigator", number: "7.2.5", title: "navigator" }
        ]
      },
      {
        id: "browser-storage",
        number: "7.3",
        title: "Browser Storage",
        topics: [
          { id: "storage-local", number: "7.3.1", title: "LocalStorage" },
          { id: "storage-session", number: "7.3.2", title: "SessionStorage" },
          { id: "storage-cookies", number: "7.3.3", title: "Cookies" }
        ]
      },
      {
        id: "browser-rendering",
        number: "7.4",
        title: "Browser Rendering",
        topics: [
          { id: "rendering-process", number: "7.4.1", title: "Browser Rendering Process" },
          { id: "rendering-reflow", number: "7.4.2", title: "Reflow" },
          { id: "rendering-repaint", number: "7.4.3", title: "Repaint" },
          { id: "rendering-layout", number: "7.4.4", title: "Layout" },
          { id: "rendering-performance", number: "7.4.5", title: "Rendering Performance" }
        ]
      },
      {
        id: "events",
        number: "7.5",
        title: "Events",
        topics: [
          { id: "events-propagation", number: "7.5.1", title: "Event Propagation" },
          { id: "events-bubbling", number: "7.5.2", title: "Event Bubbling" },
          { id: "events-capturing", number: "7.5.3", title: "Event Capturing" },
          { id: "events-delegation", number: "7.5.4", title: "Event Delegation" }
        ]
      },
      {
        id: "web-fundamentals",
        number: "7.6",
        title: "Web Fundamentals",
        topics: [
          { id: "web-http", number: "7.6.1", title: "HTTP" },
          { id: "web-https", number: "7.6.2", title: "HTTPS" },
          { id: "web-http-methods", number: "7.6.3", title: "HTTP Methods" },
          { id: "web-status-codes", number: "7.6.4", title: "HTTP Status Codes" },
          { id: "web-headers", number: "7.6.5", title: "Headers" },
          { id: "web-req-res", number: "7.6.6", title: "Request/Response" },
          { id: "web-cors", number: "7.6.7", title: "CORS" },
          { id: "web-same-origin", number: "7.6.8", title: "Same-Origin Policy" },
          { id: "web-caching", number: "7.6.9", title: "Browser Caching" }
        ]
      }
    ]
  },
  {
    id: "react-fundamentals",
    number: "8",
    title: "React Fundamentals",
    icon: "FaReact",
    color: "text-sky-500 bg-sky-50 border-sky-200",
    badgeText: "REACT",
    sections: [
      {
        id: "react-basics",
        number: "8.1",
        title: "React Basics",
        topics: [
          { id: "react-what-is", number: "8.1.1", title: "What is React?" },
          { id: "react-why", number: "8.1.2", title: "Why React?" },
          { id: "react-architecture", number: "8.1.3", title: "React Architecture" },
          { id: "react-jsx", number: "8.1.4", title: "JSX" },
          { id: "react-components-basic", number: "8.1.5", title: "Components" },
          { id: "react-props-basic", number: "8.1.6", title: "Props" },
          { id: "react-state-basic", number: "8.1.7", title: "State" }
        ]
      },
      {
        id: "components",
        number: "8.2",
        title: "Components",
        topics: [
          { id: "comp-functional", number: "8.2.1", title: "Functional Components" },
          { id: "comp-class", number: "8.2.2", title: "Class Components" },
          { id: "comp-composition", number: "8.2.3", title: "Component Composition" },
          { id: "comp-reusable", number: "8.2.4", title: "Reusable Components" },
          { id: "comp-container-presentational", number: "8.2.5", title: "Container vs Presentational Components" },
          { id: "comp-vs-inheritance", number: "8.2.6", title: "Composition vs Inheritance" }
        ]
      },
      {
        id: "props",
        number: "8.3",
        title: "Props",
        topics: [
          { id: "props-passing", number: "8.3.1", title: "Passing Props" },
          { id: "props-destructuring", number: "8.3.2", title: "Props Destructuring" },
          { id: "props-vs-state", number: "8.3.3", title: "Props vs State" },
          { id: "props-drilling", number: "8.3.4", title: "Prop Drilling" }
        ]
      },
      {
        id: "state",
        number: "8.4",
        title: "State",
        topics: [
          { id: "state-local", number: "8.4.1", title: "Local State" },
          { id: "state-updates", number: "8.4.2", title: "State Updates" },
          { id: "state-immutability", number: "8.4.3", title: "State Immutability" },
          { id: "state-derived", number: "8.4.4", title: "Derived State" },
          { id: "state-vs-props-detail", number: "8.4.5", title: "State vs Props" }
        ]
      }
    ]
  },
  {
    id: "react-rendering-lifecycle",
    number: "9",
    title: "React Rendering & Lifecycle",
    icon: "FaSyncAlt",
    color: "text-indigo-500 bg-indigo-50 border-indigo-200",
    badgeText: "RNDR",
    sections: [
      {
        id: "react-lifecycle",
        number: "9.1",
        title: "React Lifecycle",
        topics: [
          { id: "life-mounting", number: "9.1.1", title: "Mounting" },
          { id: "life-updating", number: "9.1.2", title: "Updating" },
          { id: "life-unmounting", number: "9.1.3", title: "Unmounting" },
          { id: "life-functional", number: "9.1.4", title: "Lifecycle in Functional Components" },
          { id: "life-class", number: "9.1.5", title: "Lifecycle in Class Components" }
        ]
      },
      {
        id: "rendering",
        number: "9.2",
        title: "Rendering",
        topics: [
          { id: "render-initial", number: "9.2.1", title: "Initial Render" },
          { id: "render-re-render", number: "9.2.2", title: "Re-render" },
          { id: "render-causes", number: "9.2.3", title: "What Causes Re-rendering?" },
          { id: "render-phase", number: "9.2.4", title: "Render Phase" },
          { id: "render-commit-phase", number: "9.2.5", title: "Commit Phase" }
        ]
      },
      {
        id: "virtual-dom",
        number: "9.3",
        title: "Virtual DOM",
        topics: [
          { id: "vdom-dom", number: "9.3.1", title: "DOM" },
          { id: "vdom-def", number: "9.3.2", title: "Virtual DOM" },
          { id: "vdom-vs-real", number: "9.3.3", title: "Virtual DOM vs Real DOM" },
          { id: "vdom-benefits", number: "9.3.4", title: "Benefits of Virtual DOM" }
        ]
      },
      {
        id: "reconciliation",
        number: "9.4",
        title: "Reconciliation",
        topics: [
          { id: "reconcile-def", number: "9.4.1", title: "Reconciliation" },
          { id: "reconcile-diffing", number: "9.4.2", title: "Diffing" },
          { id: "reconcile-keys", number: "9.4.3", title: "Keys" },
          { id: "reconcile-identity", number: "9.4.4", title: "Component Identity" },
          { id: "reconcile-element-updates", number: "9.4.5", title: "React Element Updates" }
        ]
      },
      {
        id: "react-strictmode",
        number: "9.5",
        title: "React StrictMode",
        topics: [
          { id: "strictmode-def", number: "9.5.1", title: "StrictMode" },
          { id: "strictmode-dev-behavior", number: "9.5.2", title: "Development Behavior" },
          { id: "strictmode-effects", number: "9.5.3", title: "Effect Execution in StrictMode" }
        ]
      }
    ]
  },
  {
    id: "react-hooks",
    number: "10",
    title: "React Hooks",
    icon: "FaAnchor",
    color: "text-violet-500 bg-violet-50 border-violet-200",
    badgeText: "HOOKS",
    sections: [
      {
        id: "basic-hooks",
        number: "10.1",
        title: "Basic Hooks",
        topics: [
          { id: "hooks-usestate", number: "10.1.1", title: "useState" },
          { id: "hooks-useeffect", number: "10.1.2", title: "useEffect" },
          { id: "hooks-useref", number: "10.1.3", title: "useRef" }
        ]
      },
      {
        id: "additional-hooks",
        number: "10.2",
        title: "Additional Hooks",
        topics: [
          { id: "hooks-usecontext", number: "10.2.1", title: "useContext" },
          { id: "hooks-usereducer", number: "10.2.2", title: "useReducer" },
          { id: "hooks-usememo", number: "10.2.3", title: "useMemo" },
          { id: "hooks-usecallback", number: "10.2.4", title: "useCallback" }
        ]
      },
      {
        id: "custom-hooks",
        number: "10.3",
        title: "Custom Hooks",
        topics: [
          { id: "custom-hooks-what-is", number: "10.3.1", title: "What is a Custom Hook?" },
          { id: "custom-hooks-rules", number: "10.3.2", title: "Rules of Hooks" },
          { id: "custom-hooks-reusable", number: "10.3.3", title: "Creating Reusable Logic" },
          { id: "custom-hooks-composition", number: "10.3.4", title: "Custom Hook Composition" }
        ]
      },
      {
        id: "useeffect-deep-dive",
        number: "10.4",
        title: "useEffect",
        topics: [
          { id: "eff-deps", number: "10.4.1", title: "Dependency Array" },
          { id: "eff-execution", number: "10.4.2", title: "Effect Execution" },
          { id: "eff-cleanup", number: "10.4.3", title: "Cleanup Function" },
          { id: "eff-multiple", number: "10.4.4", title: "Multiple Effects" },
          { id: "eff-loops", number: "10.4.5", title: "Infinite Effect Loops" },
          { id: "eff-mistakes", number: "10.4.6", title: "Common useEffect Mistakes" }
        ]
      },
      {
        id: "usememo-deep-dive",
        number: "10.5",
        title: "useMemo",
        topics: [
          { id: "memo-concept", number: "10.5.1", title: "Memoization" },
          { id: "memo-expensive", number: "10.5.2", title: "Expensive Calculations" },
          { id: "memo-deps", number: "10.5.3", title: "Dependency Array" },
          { id: "memo-when-to-use", number: "10.5.4", title: "When to Use useMemo" },
          { id: "memo-when-not-to-use", number: "10.5.5", title: "When Not to Use useMemo" }
        ]
      },
      {
        id: "usecallback-deep-dive",
        number: "10.6",
        title: "useCallback",
        topics: [
          { id: "cb-fn-memo", number: "10.6.1", title: "Function Memoization" },
          { id: "cb-deps", number: "10.6.2", title: "Dependency Array" },
          { id: "cb-when-to-use", number: "10.6.3", title: "When to Use useCallback" },
          { id: "cb-vs-usememo", number: "10.6.4", title: "useCallback vs useMemo" }
        ]
      },
      {
        id: "useref-deep-dive",
        number: "10.7",
        title: "useRef",
        topics: [
          { id: "ref-dom", number: "10.7.1", title: "DOM References" },
          { id: "ref-mutable", number: "10.7.2", title: "Mutable Values" },
          { id: "ref-vs-state", number: "10.7.3", title: "useRef vs useState" }
        ]
      }
    ]
  },
  {
    id: "react-advanced-concepts",
    number: "11",
    title: "React Advanced Concepts",
    icon: "FaLightbulb",
    color: "text-amber-500 bg-amber-50 border-amber-200",
    badgeText: "ADV",
    sections: [
      {
        id: "controlled-uncontrolled-components",
        number: "11.1",
        title: "Controlled & Uncontrolled Components",
        topics: [
          { id: "ctrl-controlled", number: "11.1.1", title: "Controlled Components" },
          { id: "ctrl-uncontrolled", number: "11.1.2", title: "Uncontrolled Components" },
          { id: "ctrl-ref", number: "11.1.3", title: "ref" },
          { id: "ctrl-comparison", number: "11.1.4", title: "Controlled vs Uncontrolled" }
        ]
      },
      {
        id: "conditional-rendering",
        number: "11.2",
        title: "Conditional Rendering",
        topics: [
          { id: "cond-if", number: "11.2.1", title: "if" },
          { id: "cond-ternary", number: "11.2.2", title: "Ternary Operator" },
          { id: "cond-logical-and", number: "11.2.3", title: "Logical &&" },
          { id: "cond-components", number: "11.2.4", title: "Conditional Components" }
        ]
      },
      {
        id: "lists-keys",
        number: "11.3",
        title: "Lists & Keys",
        topics: [
          { id: "lists-rendering", number: "11.3.1", title: "Rendering Lists" },
          { id: "lists-keys-def", number: "11.3.2", title: "Keys" },
          { id: "lists-key-selection", number: "11.3.3", title: "Key Selection" },
          { id: "lists-index-as-key", number: "11.3.4", title: "Problems with Array Index as Key" }
        ]
      },
      {
        id: "context-api",
        number: "11.4",
        title: "Context API",
        topics: [
          { id: "ctx-concept", number: "11.4.1", title: "Context" },
          { id: "ctx-provider", number: "11.4.2", title: "Provider" },
          { id: "ctx-consumer", number: "11.4.3", title: "Consumer" },
          { id: "ctx-usecontext", number: "11.4.4", title: "useContext" },
          { id: "ctx-vs-props", number: "11.4.5", title: "Context vs Props" },
          { id: "ctx-vs-redux", number: "11.4.6", title: "Context vs Redux" },
          { id: "ctx-performance", number: "11.4.7", title: "Context Performance" }
        ]
      },
      {
        id: "react-memo",
        number: "11.5",
        title: "React.memo",
        topics: [
          { id: "rmemo-comp-memo", number: "11.5.1", title: "Component Memoization" },
          { id: "rmemo-props-comp", number: "11.5.2", title: "Props Comparison" },
          { id: "rmemo-memo", number: "11.5.3", title: "React.memo" },
          { id: "rmemo-vs-usememo", number: "11.5.4", title: "React.memo vs useMemo" }
        ]
      },
      {
        id: "error-boundaries",
        number: "11.6",
        title: "Error Boundaries",
        topics: [
          { id: "eb-def", number: "11.6.1", title: "Error Boundaries" },
          { id: "eb-fallback-ui", number: "11.6.2", title: "Fallback UI" },
          { id: "eb-limitations", number: "11.6.3", title: "Error Boundary Limitations" }
        ]
      },
      {
        id: "react-portals",
        number: "11.7",
        title: "React Portals",
        topics: [
          { id: "portals-def", number: "11.7.1", title: "Portals" },
          { id: "portals-modal", number: "11.7.2", title: "Modal Implementation" },
          { id: "portals-events", number: "11.7.3", title: "Event Behavior with Portals" }
        ]
      }
    ]
  },
  {
    id: "react-router",
    number: "12",
    title: "React Router",
    icon: "FaRoute",
    color: "text-rose-500 bg-rose-50 border-rose-200",
    badgeText: "RTR",
    sections: [
      {
        id: "routing",
        number: "12.1",
        title: "Routing",
        topics: [
          { id: "rtr-spa", number: "12.1.1", title: "SPA Routing" },
          { id: "rtr-react-router", number: "12.1.2", title: "React Router" },
          { id: "rtr-routes", number: "12.1.3", title: "Routes" },
          { id: "rtr-route-params", number: "12.1.4", title: "Route Parameters" },
          { id: "rtr-query-params", number: "12.1.5", title: "Query Parameters" },
          { id: "rtr-nested", number: "12.1.6", title: "Nested Routes" },
          { id: "rtr-navigation", number: "12.1.7", title: "Navigation" },
          { id: "rtr-prog-navigation", number: "12.1.8", title: "Programmatic Navigation" }
        ]
      },
      {
        id: "protected-routes",
        number: "12.2",
        title: "Protected Routes",
        topics: [
          { id: "prot-auth-routes", number: "12.2.1", title: "Authentication-based Routes" },
          { id: "prot-authz-routes", number: "12.2.2", title: "Authorization-based Routes" },
          { id: "prot-role-routes", number: "12.2.3", title: "Role-based Routes" }
        ]
      }
    ]
  },
  {
    id: "react-forms-validation",
    number: "13",
    title: "React Forms & Validation",
    icon: "FaWpforms",
    color: "text-pink-500 bg-pink-50 border-pink-200",
    badgeText: "FORM",
    sections: [
      {
        id: "forms",
        number: "13.1",
        title: "Forms",
        topics: [
          { id: "forms-controlled", number: "13.1.1", title: "Controlled Forms" },
          { id: "forms-uncontrolled", number: "13.1.2", title: "Uncontrolled Forms" },
          { id: "forms-state", number: "13.1.3", title: "Form State" },
          { id: "forms-submission", number: "13.1.4", title: "Form Submission" },
          { id: "forms-input-handling", number: "13.1.5", title: "Input Handling" }
        ]
      },
      {
        id: "form-validation",
        number: "13.2",
        title: "Form Validation",
        topics: [
          { id: "val-client-side", number: "13.2.1", title: "Client-side Validation" },
          { id: "val-rules", number: "13.2.2", title: "Validation Rules" },
          { id: "val-error-handling", number: "13.2.3", title: "Error Handling" },
          { id: "val-hook-form", number: "13.2.4", title: "React Hook Form" },
          { id: "val-schema-validation", number: "13.2.5", title: "Form Schema Validation" },
          { id: "val-zod", number: "13.2.6", title: "Zod" }
        ]
      }
    ]
  },
  {
    id: "react-state-management",
    number: "14",
    title: "React State Management",
    icon: "FaDatabase",
    color: "text-purple-600 bg-purple-50 border-purple-200",
    badgeText: "STATE",
    sections: [
      {
        id: "state-management-concepts",
        number: "14.1",
        title: "State Management Concepts",
        topics: [
          { id: "smc-local", number: "14.1.1", title: "Local State" },
          { id: "smc-global", number: "14.1.2", title: "Global State" },
          { id: "smc-server", number: "14.1.3", title: "Server State" },
          { id: "smc-client", number: "14.1.4", title: "Client State" }
        ]
      },
      {
        id: "context-api-sm",
        number: "14.2",
        title: "Context API",
        topics: [
          { id: "sm-ctx-concept", number: "14.2.1", title: "Context" },
          { id: "sm-ctx-provider", number: "14.2.2", title: "Provider" },
          { id: "sm-ctx-consumer", number: "14.2.3", title: "Consumer" },
          { id: "sm-ctx-usecontext", number: "14.2.4", title: "useContext" }
        ]
      },
      {
        id: "redux",
        number: "14.3",
        title: "Redux",
        topics: [
          { id: "rdx-arch", number: "14.3.1", title: "Redux Architecture" },
          { id: "rdx-store", number: "14.3.2", title: "Store" },
          { id: "rdx-state", number: "14.3.3", title: "State" },
          { id: "rdx-action", number: "14.3.4", title: "Action" },
          { id: "rdx-reducer", number: "14.3.5", title: "Reducer" },
          { id: "rdx-dispatch", number: "14.3.6", title: "Dispatch" },
          { id: "rdx-selector", number: "14.3.7", title: "Selector" },
          { id: "rdx-middleware", number: "14.3.8", title: "Middleware" }
        ]
      },
      {
        id: "redux-toolkit",
        number: "14.4",
        title: "Redux Toolkit",
        topics: [
          { id: "rtk-configure-store", number: "14.4.1", title: "configureStore" },
          { id: "rtk-create-slice", number: "14.4.2", title: "createSlice" },
          { id: "rtk-thunk", number: "14.4.3", title: "createAsyncThunk" },
          { id: "rtk-immer", number: "14.4.4", title: "Immer" },
          { id: "rtk-devtools", number: "14.4.5", title: "Redux DevTools" }
        ]
      },
      {
        id: "other-state-management",
        number: "14.5",
        title: "Other State Management",
        topics: [
          { id: "other-zustand", number: "14.5.1", title: "Zustand" },
          { id: "other-react-query", number: "14.5.2", title: "React Query" }
        ]
      },
      {
        id: "state-management-comparison",
        number: "14.6",
        title: "State Management Comparison",
        topics: [
          { id: "sm-comp-local-vs-ctx", number: "14.6.1", title: "Local State vs Context" },
          { id: "sm-comp-ctx-vs-redux", number: "14.6.2", title: "Context vs Redux" },
          { id: "sm-comp-redux-vs-zustand", number: "14.6.3", title: "Redux vs Zustand" },
          { id: "sm-comp-client-vs-server", number: "14.6.4", title: "Client State vs Server State" },
          { id: "sm-comp-redux-vs-rq", number: "14.6.5", title: "Redux vs React Query" },
          { id: "sm-comp-decision", number: "14.6.6", title: "When to use which approach" }
        ]
      }
    ]
  },
  {
    id: "react-query",
    number: "15",
    title: "React Query",
    icon: "FaCloudDownloadAlt",
    color: "text-red-500 bg-red-50 border-red-200",
    badgeText: "RQ",
    sections: [
      {
        id: "core-concepts",
        number: "15.1",
        title: "Core Concepts",
        topics: [
          { id: "rq-server-state", number: "15.1.1", title: "Server State" },
          { id: "rq-query", number: "15.1.2", title: "Query" },
          { id: "rq-query-key", number: "15.1.3", title: "Query Key" },
          { id: "rq-query-function", number: "15.1.4", title: "Query Function" },
          { id: "rq-cache", number: "15.1.5", title: "Cache" },
          { id: "rq-stale-data", number: "15.1.6", title: "Stale Data" }
        ]
      },
      {
        id: "queries",
        number: "15.2",
        title: "Queries",
        topics: [
          { id: "rq-usequery", number: "15.2.1", title: "useQuery" },
          { id: "rq-fetching", number: "15.2.2", title: "Fetching" },
          { id: "rq-loading-state", number: "15.2.3", title: "Loading State" },
          { id: "rq-error-state", number: "15.2.4", title: "Error State" },
          { id: "rq-refetching", number: "15.2.5", title: "Refetching" }
        ]
      },
      {
        id: "mutations",
        number: "15.3",
        title: "Mutations",
        topics: [
          { id: "rq-usemutation", number: "15.3.1", title: "useMutation" },
          { id: "rq-create", number: "15.3.2", title: "Create" },
          { id: "rq-update", number: "15.3.3", title: "Update" },
          { id: "rq-delete", number: "15.3.4", title: "Delete" }
        ]
      },
      {
        id: "advanced-rq",
        number: "15.4",
        title: "Advanced",
        topics: [
          { id: "rq-invalidation", number: "15.4.1", title: "Query Invalidation" },
          { id: "rq-caching", number: "15.4.2", title: "Caching" },
          { id: "rq-optimistic", number: "15.4.3", title: "Optimistic Updates" },
          { id: "rq-pagination", number: "15.4.4", title: "Pagination" },
          { id: "rq-bg-refetch", number: "15.4.5", title: "Background Refetching" },
          { id: "rq-retry", number: "15.4.6", title: "Retry" }
        ]
      }
    ]
  },
  {
    id: "react-performance-optimization",
    number: "16",
    title: "React Performance Optimization",
    icon: "FaTachometerAlt",
    color: "text-amber-500 bg-amber-50 border-amber-200",
    badgeText: "PERF",
    sections: [
      {
        id: "re-render-optimization",
        number: "16.1",
        title: "Re-render Optimization",
        topics: [
          { id: "perf-unnecessary-renders", number: "16.1.1", title: "Unnecessary Re-renders" },
          { id: "perf-comp-re-rendering", number: "16.1.2", title: "Component Re-rendering" },
          { id: "perf-react-memo", number: "16.1.3", title: "React.memo" },
          { id: "perf-usememo", number: "16.1.4", title: "useMemo" },
          { id: "perf-usecallback", number: "16.1.5", title: "useCallback" }
        ]
      },
      {
        id: "loading-optimization",
        number: "16.2",
        title: "Loading Optimization",
        topics: [
          { id: "perf-lazy-loading", number: "16.2.1", title: "Lazy Loading" },
          { id: "perf-react-lazy", number: "16.2.2", title: "React.lazy" },
          { id: "perf-suspense", number: "16.2.3", title: "Suspense" },
          { id: "perf-code-splitting", number: "16.2.4", title: "Code Splitting" },
          { id: "perf-dynamic-imports", number: "16.2.5", title: "Dynamic Imports" }
        ]
      },
      {
        id: "data-optimization",
        number: "16.3",
        title: "Data Optimization",
        topics: [
          { id: "perf-pagination", number: "16.3.1", title: "Pagination" },
          { id: "perf-virtualization", number: "16.3.2", title: "Virtualization" },
          { id: "perf-caching", number: "16.3.3", title: "Caching" },
          { id: "perf-debouncing", number: "16.3.4", title: "Debouncing" },
          { id: "perf-throttling", number: "16.3.5", title: "Throttling" }
        ]
      },
      {
        id: "performance-analysis",
        number: "16.4",
        title: "Performance Analysis",
        topics: [
          { id: "perf-react-devtools", number: "16.4.1", title: "React DevTools" },
          { id: "perf-profiler", number: "16.4.2", title: "React Profiler" },
          { id: "perf-bundle-size", number: "16.4.3", title: "Bundle Size" },
          { id: "perf-rendering-perf", number: "16.4.4", title: "Rendering Performance" },
          { id: "perf-network-perf", number: "16.4.5", title: "Network Performance" }
        ]
      }
    ]
  },
  {
    id: "api-integration",
    number: "17",
    title: "API Integration",
    icon: "FaExchangeAlt",
    color: "text-teal-500 bg-teal-50 border-teal-200",
    badgeText: "API",
    sections: [
      {
        id: "rest-apis",
        number: "17.1",
        title: "REST APIs",
        topics: [
          { id: "api-rest", number: "17.1.1", title: "REST" },
          { id: "api-resources", number: "17.1.2", title: "Resources" },
          {
            id: "api-methods",
            number: "17.1.3",
            title: "HTTP Methods",
            subtopics: [
              { id: "api-method-get", title: "GET" },
              { id: "api-method-post", title: "POST" },
              { id: "api-method-put", title: "PUT" },
              { id: "api-method-patch", title: "PATCH" },
              { id: "api-method-delete", title: "DELETE" }
            ]
          },
          { id: "api-status-codes", number: "17.1.4", title: "HTTP Status Codes" }
        ]
      },
      {
        id: "axios",
        number: "17.2",
        title: "Axios",
        topics: [
          { id: "axios-def", number: "17.2.1", title: "Axios" },
          { id: "axios-get-post", number: "17.2.2", title: "GET/POST Requests" },
          { id: "axios-config", number: "17.2.3", title: "Request Configuration" },
          { id: "axios-headers", number: "17.2.4", title: "Headers" },
          { id: "axios-error-handling", number: "17.2.5", title: "Error Handling" },
          { id: "axios-interceptors", number: "17.2.6", title: "Axios Interceptors" }
        ]
      },
      {
        id: "api-handling-in-react",
        number: "17.3",
        title: "API Handling in React",
        topics: [
          { id: "api-react-loading", number: "17.3.1", title: "Loading State" },
          { id: "api-react-error", number: "17.3.2", title: "Error State" },
          { id: "api-react-success", number: "17.3.3", title: "Success State" },
          { id: "api-react-caching", number: "17.3.4", title: "API Caching" },
          { id: "api-react-pagination", number: "17.3.5", title: "Pagination" },
          { id: "api-react-filtering", number: "17.3.6", title: "Filtering" },
          { id: "api-react-sorting", number: "17.3.7", title: "Sorting" },
          { id: "api-react-cancellation", number: "17.3.8", title: "Request Cancellation" }
        ]
      },
      {
        id: "abortcontroller",
        number: "17.4",
        title: "AbortController",
        topics: [
          { id: "abort-req-cancellation", number: "17.4.1", title: "Request Cancellation" },
          { id: "abort-cancelling-previous", number: "17.4.2", title: "Cancelling Previous Requests" },
          { id: "abort-search-api", number: "17.4.3", title: "Search API Cancellation" }
        ]
      }
    ]
  },
  {
    id: "authentication-authorization",
    number: "18",
    title: "Authentication & Authorization",
    icon: "FaLock",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    badgeText: "AUTH",
    sections: [
      {
        id: "authentication",
        number: "18.1",
        title: "Authentication",
        topics: [
          { id: "auth-login", number: "18.1.1", title: "Login" },
          { id: "auth-logout", number: "18.1.2", title: "Logout" },
          { id: "auth-jwt", number: "18.1.3", title: "JWT" },
          { id: "auth-access-token", number: "18.1.4", title: "Access Token" },
          { id: "auth-refresh-token", number: "18.1.5", title: "Refresh Token" },
          { id: "auth-token-expiration", number: "18.1.6", title: "Token Expiration" }
        ]
      },
      {
        id: "authorization",
        number: "18.2",
        title: "Authorization",
        topics: [
          { id: "authz-vs-auth", number: "18.2.1", title: "Authentication vs Authorization" },
          { id: "authz-rbac", number: "18.2.2", title: "Role-Based Access Control" },
          { id: "authz-pbac", number: "18.2.3", title: "Permission-Based Access Control" },
          { id: "authz-protected-routes", number: "18.2.4", title: "Protected Routes" },
          { id: "authz-protected-components", number: "18.2.5", title: "Protected Components" }
        ]
      },
      {
        id: "frontend-security",
        number: "18.3",
        title: "Frontend Security",
        topics: [
          { id: "sec-frontend-authz", number: "18.3.1", title: "Frontend Authorization" },
          { id: "sec-backend-authz", number: "18.3.2", title: "Backend Authorization" },
          { id: "sec-token-storage", number: "18.3.3", title: "Token Storage" },
          { id: "sec-secure-requests", number: "18.3.4", title: "Secure API Requests" }
        ]
      }
    ]
  },
  {
    id: "frontend-architecture",
    number: "19",
    title: "Frontend Architecture",
    icon: "FaSitemap",
    color: "text-blue-500 bg-blue-50 border-blue-200",
    badgeText: "ARCH",
    sections: [
      {
        id: "architecture",
        number: "19.1",
        title: "Architecture",
        topics: [
          { id: "arch-component", number: "19.1.1", title: "Component Architecture" },
          { id: "arch-modular", number: "19.1.2", title: "Modular Architecture" },
          { id: "arch-feature-based", number: "19.1.3", title: "Feature-based Structure" },
          { id: "arch-separation", number: "19.1.4", title: "Separation of Concerns" },
          { id: "arch-reusable", number: "19.1.5", title: "Reusable Components" }
        ]
      },
      {
        id: "code-organization",
        number: "19.2",
        title: "Code Organization",
        topics: [
          { id: "org-components", number: "19.2.1", title: "Components" },
          { id: "org-pages", number: "19.2.2", title: "Pages" },
          { id: "org-hooks", number: "19.2.3", title: "Hooks" },
          { id: "org-services", number: "19.2.4", title: "Services" },
          { id: "org-utilities", number: "19.2.5", title: "Utilities" },
          { id: "org-state", number: "19.2.6", title: "State" },
          { id: "org-api-layer", number: "19.2.7", title: "API Layer" },
          { id: "org-constants", number: "19.2.8", title: "Constants" }
        ]
      },
      {
        id: "design-principles",
        number: "19.3",
        title: "Design Principles",
        topics: [
          { id: "principle-dry", number: "19.3.1", title: "DRY" },
          { id: "principle-srp", number: "19.3.2", title: "Single Responsibility" },
          { id: "principle-reusability", number: "19.3.3", title: "Reusability" },
          { id: "principle-maintainability", number: "19.3.4", title: "Maintainability" },
          { id: "principle-scalability", number: "19.3.5", title: "Scalability" }
        ]
      }
    ]
  },
  {
    id: "html",
    number: "20",
    title: "HTML",
    icon: "FaHtml5",
    color: "text-orange-500 bg-orange-50 border-orange-200",
    badgeText: "HTML",
    sections: [
      {
        id: "html-fundamentals",
        number: "20.1",
        title: "HTML Fundamentals",
        topics: [
          { id: "html-semantic", number: "20.1.1", title: "Semantic HTML" },
          { id: "html-forms", number: "20.1.2", title: "Forms" },
          { id: "html-input-types", number: "20.1.3", title: "Input Types" },
          { id: "html-attributes", number: "20.1.4", title: "Attributes" },
          { id: "html-tables", number: "20.1.5", title: "Tables" },
          { id: "html-lists", number: "20.1.6", title: "Lists" }
        ]
      },
      {
        id: "accessibility",
        number: "20.2",
        title: "Accessibility",
        topics: [
          { id: "a11y-aria", number: "20.2.1", title: "ARIA" },
          { id: "a11y-labels", number: "20.2.2", title: "Labels" },
          { id: "a11y-keyboard", number: "20.2.3", title: "Keyboard Accessibility" },
          { id: "a11y-semantic-elements", number: "20.2.4", title: "Semantic Elements" }
        ]
      }
    ]
  },
  {
    id: "css",
    number: "21",
    title: "CSS",
    icon: "FaCss3Alt",
    color: "text-sky-500 bg-sky-50 border-sky-200",
    badgeText: "CSS",
    sections: [
      {
        id: "css-fundamentals",
        number: "21.1",
        title: "CSS Fundamentals",
        topics: [
          { id: "css-box-model", number: "21.1.1", title: "Box Model" },
          { id: "css-display", number: "21.1.2", title: "Display" },
          { id: "css-position", number: "21.1.3", title: "Position" },
          { id: "css-specificity", number: "21.1.4", title: "Specificity" },
          { id: "css-inheritance", number: "21.1.5", title: "Inheritance" },
          { id: "css-z-index", number: "21.1.6", title: "z-index" },
          { id: "css-overflow", number: "21.1.7", title: "Overflow" }
        ]
      },
      {
        id: "layout",
        number: "21.2",
        title: "Layout",
        topics: [
          { id: "layout-flexbox", number: "21.2.1", title: "Flexbox" },
          { id: "layout-grid", number: "21.2.2", title: "Grid" }
        ]
      },
      {
        id: "responsive-design",
        number: "21.3",
        title: "Responsive Design",
        topics: [
          { id: "resp-media-queries", number: "21.3.1", title: "Media Queries" },
          { id: "resp-units", number: "21.3.2", title: "Responsive Units" },
          { id: "resp-mobile-first", number: "21.3.3", title: "Mobile-first Design" },
          { id: "resp-cross-browser", number: "21.3.4", title: "Cross-browser Compatibility" }
        ]
      },
      {
        id: "tailwind-css",
        number: "21.4",
        title: "Tailwind CSS",
        topics: [
          { id: "tw-utility-classes", number: "21.4.1", title: "Utility Classes" },
          { id: "tw-responsive-classes", number: "21.4.2", title: "Responsive Classes" },
          { id: "tw-component-styling", number: "21.4.3", title: "Component Styling" },
          { id: "tw-customization", number: "21.4.4", title: "Customization" }
        ]
      }
    ]
  },
  {
    id: "typescript",
    number: "22",
    title: "TypeScript",
    icon: "FaFileCode",
    color: "text-blue-500 bg-blue-50 border-blue-200",
    badgeText: "TS",
    sections: [
      {
        id: "ts-fundamentals",
        number: "22.1",
        title: "Fundamentals",
        topics: [
          { id: "ts-types", number: "22.1.1", title: "Types" },
          { id: "ts-inference", number: "22.1.2", title: "Type Inference" },
          { id: "ts-annotations", number: "22.1.3", title: "Type Annotations" },
          { id: "ts-interfaces", number: "22.1.4", title: "Interfaces" },
          { id: "ts-aliases", number: "22.1.5", title: "Type Aliases" }
        ]
      },
      {
        id: "advanced-types",
        number: "22.2",
        title: "Advanced Types",
        topics: [
          { id: "ts-union", number: "22.2.1", title: "Union Types" },
          { id: "ts-intersection", number: "22.2.2", title: "Intersection Types" },
          { id: "ts-generics", number: "22.2.3", title: "Generics" },
          { id: "ts-optional-props", number: "22.2.4", title: "Optional Properties" },
          { id: "ts-literal-types", number: "22.2.5", title: "Literal Types" },
          { id: "ts-narrowing", number: "22.2.6", title: "Type Narrowing" },
          { id: "ts-any", number: "22.2.7", title: "any" },
          { id: "ts-unknown", number: "22.2.8", title: "unknown" },
          { id: "ts-never", number: "22.2.9", title: "never" }
        ]
      },
      {
        id: "utility-types",
        number: "22.3",
        title: "Utility Types",
        topics: [
          { id: "ts-partial", number: "22.3.1", title: "Partial" },
          { id: "ts-pick", number: "22.3.2", title: "Pick" },
          { id: "ts-omit", number: "22.3.3", title: "Omit" },
          { id: "ts-record", number: "22.3.4", title: "Record" },
          { id: "ts-required", number: "22.3.5", title: "Required" },
          { id: "ts-readonly", number: "22.3.6", title: "Readonly" }
        ]
      },
      {
        id: "typescript-with-react",
        number: "22.4",
        title: "TypeScript with React",
        topics: [
          { id: "ts-react-props", number: "22.4.1", title: "Component Props" },
          { id: "ts-react-state", number: "22.4.2", title: "State Types" },
          { id: "ts-react-events", number: "22.4.3", title: "Event Types" },
          { id: "ts-react-api-types", number: "22.4.4", title: "API Response Types" },
          { id: "ts-react-generic-comp", number: "22.4.5", title: "Generic Components" }
        ]
      }
    ]
  },
  {
    id: "git-development-workflow",
    number: "23",
    title: "Git & Development Workflow",
    icon: "FaGitAlt",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    badgeText: "GIT",
    sections: [
      {
        id: "git-fundamentals",
        number: "23.1",
        title: "Git Fundamentals",
        topics: [
          { id: "git-repo", number: "23.1.1", title: "Repository" },
          { id: "git-commit", number: "23.1.2", title: "Commit" },
          { id: "git-branch", number: "23.1.3", title: "Branch" },
          { id: "git-remote", number: "23.1.4", title: "Remote" },
          { id: "git-pull", number: "23.1.5", title: "Pull" },
          { id: "git-push", number: "23.1.6", title: "Push" },
          { id: "git-fetch", number: "23.1.7", title: "Fetch" }
        ]
      },
      {
        id: "git-commands",
        number: "23.2",
        title: "Git Commands",
        topics: [
          { id: "git-cmd-clone", number: "23.2.1", title: "clone" },
          { id: "git-cmd-branch", number: "23.2.2", title: "branch" },
          { id: "git-cmd-switch", number: "23.2.3", title: "switch" },
          { id: "git-cmd-checkout", number: "23.2.4", title: "checkout" },
          { id: "git-cmd-merge", number: "23.2.5", title: "merge" },
          { id: "git-cmd-rebase", number: "23.2.6", title: "rebase" },
          { id: "git-cmd-stash", number: "23.2.7", title: "stash" },
          { id: "git-cmd-cherry-pick", number: "23.2.8", title: "cherry-pick" },
          { id: "git-cmd-reset", number: "23.2.9", title: "reset" },
          { id: "git-cmd-revert", number: "23.2.10", title: "revert" }
        ]
      },
      {
        id: "collaboration",
        number: "23.3",
        title: "Collaboration",
        topics: [
          { id: "git-collab-branching", number: "23.3.1", title: "Branching Strategy" },
          { id: "git-collab-pr", number: "23.3.2", title: "Pull Requests" },
          { id: "git-collab-code-reviews", number: "23.3.3", title: "Code Reviews" },
          { id: "git-collab-merge-conflicts", number: "23.3.4", title: "Merge Conflicts" }
        ]
      }
    ]
  },
  {
    id: "testing",
    number: "24",
    title: "Testing",
    icon: "FaVial",
    color: "text-emerald-500 bg-emerald-50 border-emerald-200",
    badgeText: "TEST",
    sections: [
      {
        id: "testing-concepts",
        number: "24.1",
        title: "Testing Concepts",
        topics: [
          { id: "test-unit", number: "24.1.1", title: "Unit Testing" },
          { id: "test-integration", number: "24.1.2", title: "Integration Testing" },
          { id: "test-component", number: "24.1.3", title: "Component Testing" },
          { id: "test-e2e", number: "24.1.4", title: "End-to-End Testing" }
        ]
      },
      {
        id: "jest",
        number: "24.2",
        title: "Jest",
        topics: [
          { id: "jest-cases", number: "24.2.1", title: "Test Cases" },
          { id: "jest-matchers", number: "24.2.2", title: "Matchers" },
          { id: "jest-mocking", number: "24.2.3", title: "Mocking" },
          { id: "jest-async", number: "24.2.4", title: "Async Testing" }
        ]
      },
      {
        id: "react-testing-library",
        number: "24.3",
        title: "React Testing Library",
        topics: [
          { id: "rtl-rendering", number: "24.3.1", title: "Rendering Components" },
          { id: "rtl-queries", number: "24.3.2", title: "Queries" },
          { id: "rtl-user-interaction", number: "24.3.3", title: "User Interaction" },
          { id: "rtl-api-mocking", number: "24.3.4", title: "API Mocking" }
        ]
      }
    ]
  },
  {
    id: "cicd-deployment",
    number: "25",
    title: "CI/CD & Deployment",
    icon: "FaRocket",
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    badgeText: "CI/CD",
    sections: [
      {
        id: "cicd-fundamentals",
        number: "25.1",
        title: "CI/CD Fundamentals",
        topics: [
          { id: "cicd-ci", number: "25.1.1", title: "Continuous Integration" },
          { id: "cicd-cd-delivery", number: "25.1.2", title: "Continuous Delivery" },
          { id: "cicd-cd-deploy", number: "25.1.3", title: "Continuous Deployment" },
          { id: "cicd-build-pipeline", number: "25.1.4", title: "Build Pipeline" },
          { id: "cicd-deploy-pipeline", number: "25.1.5", title: "Deployment Pipeline" }
        ]
      },
      {
        id: "frontend-pipeline",
        number: "25.2",
        title: "Frontend Pipeline",
        topics: [
          { id: "pipe-git-push", number: "25.2.1", title: "Git Push" },
          { id: "pipe-install-deps", number: "25.2.2", title: "Install Dependencies" },
          { id: "pipe-lint", number: "25.2.3", title: "Lint" },
          { id: "pipe-test", number: "25.2.4", title: "Test" },
          { id: "pipe-build", number: "25.2.5", title: "Build" },
          { id: "pipe-deploy", number: "25.2.6", title: "Deploy" }
        ]
      },
      {
        id: "deployment-concepts",
        number: "25.3",
        title: "Deployment Concepts",
        topics: [
          { id: "deploy-env-vars", number: "25.3.1", title: "Environment Variables" },
          { id: "deploy-dev", number: "25.3.2", title: "Development" },
          { id: "deploy-staging", number: "25.3.3", title: "Staging" },
          { id: "deploy-prod", number: "25.3.4", title: "Production" },
          { id: "deploy-artifacts", number: "25.3.5", title: "Build Artifacts" }
        ]
      }
    ]
  },
  {
    id: "ai-assisted-development",
    number: "26",
    title: "AI-Assisted Development",
    icon: "FaRobot",
    color: "text-purple-500 bg-purple-50 border-purple-200",
    badgeText: "AI",
    sections: [
      {
        id: "ai-development-tools",
        number: "26.1",
        title: "AI Development Tools",
        topics: [
          { id: "ai-assisted-coding", number: "26.1.1", title: "AI-assisted Coding" },
          { id: "ai-code-generation", number: "26.1.2", title: "Code Generation" },
          { id: "ai-debugging", number: "26.1.3", title: "Debugging" },
          { id: "ai-refactoring", number: "26.1.4", title: "Refactoring" },
          { id: "ai-documentation", number: "26.1.5", title: "Documentation" },
          { id: "ai-test-generation", number: "26.1.6", title: "Test Generation" }
        ]
      },
      {
        id: "responsible-ai-usage",
        number: "26.2",
        title: "Responsible AI Usage",
        topics: [
          { id: "ai-code-validation", number: "26.2.1", title: "Code Validation" },
          { id: "ai-security-review", number: "26.2.2", title: "Security Review" },
          { id: "ai-hallucinations", number: "26.2.3", title: "Hallucinations" },
          { id: "ai-code-quality", number: "26.2.4", title: "Code Quality" },
          { id: "ai-accelerator", number: "26.2.5", title: "AI as Development Accelerator" }
        ]
      }
    ]
  },
  {
    id: "project-architecture-revision",
    number: "27",
    title: "Project & Architecture Revision",
    icon: "FaClipboardList",
    color: "text-red-500 bg-red-50 border-red-200",
    badgeText: "PROJ",
    sections: [
      {
        id: "infield",
        number: "27.1",
        title: "Infield",
        topics: [
          { id: "infield-overview", number: "27.1.1", title: "Project Overview" },
          { id: "infield-business-problem", number: "27.1.2", title: "Business Problem" },
          { id: "infield-user-roles", number: "27.1.3", title: "User Roles" },
          { id: "infield-frontend-arch", number: "27.1.4", title: "Frontend Architecture" },
          { id: "infield-component-arch", number: "27.1.5", title: "Component Architecture" },
          { id: "infield-redux-arch", number: "27.1.6", title: "Redux Architecture" },
          { id: "infield-api-integration", number: "27.1.7", title: "API Integration" },
          { id: "infield-auth", number: "27.1.8", title: "Authentication" },
          { id: "infield-authz", number: "27.1.9", title: "Authorization" },
          { id: "infield-rbac", number: "27.1.10", title: "RBAC" },
          { id: "infield-approval-wf", number: "27.1.11", title: "Approval Workflow" },
          { id: "infield-checklists", number: "27.1.12", title: "Dynamic Checklists" },
          { id: "infield-hierarchical-users", number: "27.1.13", title: "Hierarchical User Management" },
          { id: "infield-file-upload", number: "27.1.14", title: "File Upload" },
          { id: "infield-aws-s3", number: "27.1.15", title: "AWS S3" },
          { id: "infield-cloudinary", number: "27.1.16", title: "Cloudinary" },
          { id: "infield-media-handling", number: "27.1.17", title: "Secure Media Handling" },
          { id: "infield-signatures", number: "27.1.18", title: "Signatures" },
          { id: "infield-documents", number: "27.1.19", title: "Documents" },
          { id: "infield-socket-io", number: "27.1.20", title: "Socket.io" },
          { id: "infield-real-time", number: "27.1.21", title: "Real-time Updates" },
          { id: "infield-perf-optimization", number: "27.1.22", title: "Performance Optimization" },
          { id: "infield-cicd", number: "27.1.23", title: "CI/CD" },
          { id: "infield-git-workflow", number: "27.1.24", title: "Git Workflow" }
        ]
      },
      {
        id: "expense-tracker",
        number: "27.2",
        title: "Expense Tracker",
        topics: [
          { id: "expense-architecture", number: "27.2.1", title: "Architecture" },
          { id: "expense-redux-toolkit", number: "27.2.2", title: "Redux Toolkit" },
          { id: "expense-react-query", number: "27.2.3", title: "React Query" },
          { id: "expense-real-time", number: "27.2.4", title: "Real-time Updates" },
          { id: "expense-splitting", number: "27.2.5", title: "Expense Splitting" },
          { id: "expense-api-integration", number: "27.2.6", title: "API Integration" },
          { id: "expense-auth", number: "27.2.7", title: "Authentication" },
          { id: "expense-filtering", number: "27.2.8", title: "Filtering" },
          { id: "expense-dashboard", number: "27.2.9", title: "Dashboard" },
          { id: "expense-xlsx-export", number: "27.2.10", title: "XLSX Export" }
        ]
      },
      {
        id: "documentation-builder",
        number: "27.3",
        title: "Documentation Builder",
        topics: [
          { id: "doc-architecture", number: "27.3.1", title: "Architecture" },
          { id: "doc-drag-drop", number: "27.3.2", title: "Drag & Drop" },
          { id: "doc-file-upload", number: "27.3.3", title: "File Upload" },
          { id: "doc-img-comparison", number: "27.3.4", title: "Image Comparison" },
          { id: "doc-pdf-export", number: "27.3.5", title: "PDF/Word Export" },
          { id: "doc-ocr", number: "27.3.6", title: "OCR" },
          { id: "doc-performance", number: "27.3.7", title: "Performance" }
        ]
      },
      {
        id: "mern-learning-tracker",
        number: "27.4",
        title: "MERN Learning Tracker",
        topics: [
          { id: "mern-typescript", number: "27.4.1", title: "TypeScript" },
          { id: "mern-redux-toolkit", number: "27.4.2", title: "Redux Toolkit" },
          { id: "mern-zustand", number: "27.4.3", title: "Zustand" },
          { id: "mern-react-query", number: "27.4.4", title: "React Query" },
          { id: "mern-auth", number: "27.4.5", title: "Authentication" },
          { id: "mern-ai-integration", number: "27.4.6", title: "AI Integration" },
          { id: "mern-analytics", number: "27.4.7", title: "Analytics" },
          { id: "mern-search", number: "27.4.8", title: "Search" },
          { id: "mern-api-architecture", number: "27.4.9", title: "API Architecture" }
        ]
      }
    ]
  }
];

// Helper functions for roadmap traversal and progress statistics
export function getAllTopicsAndSubtopics() {
  const items = [];
  ROADMAP_DATA.forEach((category) => {
    category.sections.forEach((section) => {
      section.topics.forEach((topic) => {
        if (topic.subtopics && topic.subtopics.length > 0) {
          topic.subtopics.forEach((sub) => {
            items.push({
              id: sub.id,
              title: sub.title,
              parentTopicId: topic.id,
              parentTopicTitle: topic.title,
              sectionId: section.id,
              sectionTitle: section.title,
              categoryId: category.id,
              categoryTitle: category.title,
              isSubtopic: true
            });
          });
        } else {
          items.push({
            id: topic.id,
            title: topic.title,
            number: topic.number,
            sectionId: section.id,
            sectionTitle: section.title,
            categoryId: category.id,
            categoryTitle: category.title,
            isSubtopic: false
          });
        }
      });
    });
  });
  return items;
}

export function getSectionItemIds(section) {
  const ids = [];
  section.topics.forEach((topic) => {
    if (topic.subtopics && topic.subtopics.length > 0) {
      topic.subtopics.forEach((sub) => ids.push(sub.id));
    } else {
      ids.push(topic.id);
    }
  });
  return ids;
}

export function getCategoryItemIds(category) {
  const ids = [];
  category.sections.forEach((section) => {
    ids.push(...getSectionItemIds(section));
  });
  return ids;
}

export function getTotalRoadmapItemIds() {
  const ids = [];
  ROADMAP_DATA.forEach((cat) => {
    ids.push(...getCategoryItemIds(cat));
  });
  return ids;
}
