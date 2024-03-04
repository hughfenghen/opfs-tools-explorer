import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
  Tree,
  MultiBackend,
  DragLayerMonitorProps,
  getDescendants,
  getBackendOptions,
} from '@minoru/react-dnd-treeview';
import { NodeModel, CustomData, DropOptions } from './types';
import { CustomNode } from './CustomNode';
import { CustomDragPreview } from './CustomDragPreview';
import { AddDialog, NewNodeType } from './AddDialog';
import { theme } from './theme';
import styles from './App.module.css';
import { file, dir, write } from 'opfs-tools';
import { FilePreviewer } from './FilePreviewer';
import {
  dirTree,
  fsItem2TreeNode,
  joinPath,
  previewNodeAtom,
  treeDataAtom,
} from './common';
import { useAtom } from 'jotai';

async function initFiles() {
  if ((await dir('/').children()).length > 1) return;

  await write('/opfs-tools/dir1/file1', 'file');
  await write('/opfs-tools/dir1/file2', 'file');
  await write('/opfs-tools/dir2/file1', 'file');
  await dir('/.Trash').create();
}

async function getInitData(dirPath: string, rs: NodeModel<CustomData>[]) {
  for (const it of await dir(dirPath).children()) {
    rs.push(fsItem2TreeNode(it));
    if (it.kind === 'dir') {
      await getInitData(it.path, rs);
    }
  }
}

function App() {
  const [treeData, setTreeData] = useAtom(treeDataAtom);
  const [previewNode, setPreviewNode] = useAtom(previewNodeAtom);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);

  const handleDrop = async (changeData: DropOptions<CustomData>) => {
    if (changeData.dragSource == null) return;

    const newDir = await (changeData.dragSource.data.kind === 'dir'
      ? dir
      : file)(changeData.dragSourceId).moveTo(dir(changeData.dropTargetId));
    const newData = (await dirTree(newDir)).map((it) => fsItem2TreeNode(it));

    const deleteIds = getDescendants(treeData, changeData.dragSource.id)
      .map((node) => node.id)
      .concat(changeData.dragSource.id)
      .concat(newData.map((it) => it.id));

    const newTree = treeData
      .filter((node) => !deleteIds.includes(node.id))
      .concat(newData);

    setTreeData(newTree);
  };

  useEffect(() => {
    (async () => {
      await initFiles();
      const tree = [fsItem2TreeNode(dir('/'))];
      await getInitData('/', tree);
      setTreeData(tree);
    })();
  }, []);

  const handleSubmit = async ({
    nodeType,
    path,
    files,
  }: {
    nodeType: NewNodeType;
    path: string;
    files?: File[];
  }) => {
    const p = joinPath('/', path);
    let fsItems = [];
    if (nodeType === 'dir') {
      fsItems.push(await dir(p).create());
    } else if (nodeType === 'file') {
      await write(p, '');
      fsItems.push(file(p));
    } else if (nodeType === 'import' && files != null) {
      await Promise.all(files.map((f) => write(f.name, f.stream())));
      fsItems.push(...files.map((f) => file(joinPath('/', f.name))));
    }

    setTreeData([...treeData, ...fsItems.map((it) => fsItem2TreeNode(it))]);
    setOpenAddDialog(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app} onClick={() => setPreviewNode(false)}>
          <div>
            <Button
              onClick={() => setOpenAddDialog(true)}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
            {openAddDialog && (
              <AddDialog
                tree={treeData}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleSubmit}
              />
            )}
          </div>
          <Tree
            tree={treeData}
            rootId={'/'}
            render={(node, options) => (
              <CustomNode
                node={node as NodeModel<CustomData>}
                {...options}
                onPreview={setPreviewNode}
              />
            )}
            dragPreviewRender={(
              monitorProps: DragLayerMonitorProps<CustomData>
            ) => <CustomDragPreview monitorProps={monitorProps} />}
            onDrop={(_, changeData) => {
              handleDrop(changeData as DropOptions<CustomData>);
            }}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget,
            }}
          />
          {previewNode != false && (
            <FilePreviewer
              tree={treeData}
              node={previewNode}
              onClose={() => setPreviewNode(false)}
            ></FilePreviewer>
          )}
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
