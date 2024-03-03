import { atom } from 'jotai';
import { CustomData, NodeModel } from './types';
import { dir, file } from 'opfs-tools';

export function detectFileType(
  path: string
): 'video' | 'audio' | 'image' | 'text' {
  if (/\.(mp4|av1|ogg|webm|mov)$/.test(path)) return 'video';
  if (/\.(m4a|mp3)$/.test(path)) return 'audio';
  if (/\.(png|jpe?g|webp|gif|avif)$/.test(path)) return 'image';

  return 'text';
}

export function joinPath(p1: string, p2: string) {
  return `${p1}/${p2}`.replace('//', '/');
}

type FSItem = ReturnType<typeof dir> | ReturnType<typeof file>;
export function fsItem2TreeNode(it: FSItem) {
  return {
    id: it.path,
    parent: it.parent?.path ?? '',
    droppable: it.kind === 'dir',
    text: it.name,
    data: {
      kind: it.kind,
      fileType: detectFileType(it.path),
      fileSize: '0KB',
    },
  };
}

export async function dirTree(it: FSItem): Promise<Array<FSItem>> {
  if (it.kind === 'file') return [it];
  return (await it.children()).reduce(
    async (acc, cur) => [...(await acc), ...(await dirTree(cur))],
    Promise.resolve([it]) as Promise<FSItem[]>
  )
}

export const treeDataAtom = atom<NodeModel<CustomData>[]>([]);

export const previewNodeAtom = atom<NodeModel<CustomData> | false>(false);
