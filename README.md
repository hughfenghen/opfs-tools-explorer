Manage OPFS assets in your web site, supporting file creation, copying, and moving features, providing a user-friendly interactive experience.

The basic file operation capabilities are provided by [opfs-tools](https://github.com/hughfenghen/opfs-tools).

Experience the [online demo](https://hughfenghen.github.io/opfs-tools-explorer/) now.

![image](https://github.com/hughfenghen/opfs-tools-explorer/assets/3307051/30eca629-efc0-4534-9538-1226c34521d4)

## Usage

```html
<script src="https://cdn.jsdelivr.net/npm/opfs-tools-explorer"></script>
<script>
  OTExplorer.init();
</script>
```

Or

`npm install opfs-tools-explorer`

```js
import { init, OTExplorerComp } from 'opfs-tools-explorer';
init();

// React component
// Only the file management panel will be available, no entry icon will be added to document.body
// root.render(<OTExplorerComp />)
```
