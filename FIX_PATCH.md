
### Passage Auth Workaround using Nest Framework


Replace default import for passage from dist file with following:

```

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

// ... 

const passage_node_1 = __importDefault(require("@passageidentity/passage-node"));

```