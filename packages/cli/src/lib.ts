// The diagram logic the CLI shares with the editor, from the library's source.
// Only plain modules: nothing here pulls in React or CSS.
export { parseDiagram, createShape, createImageNode, createEdge, KIND_NAMES, SHAPES } from '../../isodraw/src/lib/shapes';
export { mergeDiagrams } from '../../isodraw/src/lib/merge';
export { levelAt, withLevel, validLevel, levelNodes, liftEmbeds, type LevelPath } from '../../isodraw/src/lib/levels';
export { exportDocsMarkdown, nodeTitle, edgeTitle } from '../../isodraw/src/lib/docs';
export { containerOf, isContainer, parentMap } from '../../isodraw/src/lib/containers';
export { importTerraform, isTerraformJson } from '../../isodraw/src/lib/terraform';
export { catalogEntry, iconTypes } from '../../isodraw/src/lib/terraformCatalog';
export { cloudIconUrl } from '../../isodraw/src/lib/icons';
export { ISO_ICON_COLOR, isIsoIcon, isoIconLibrary } from '../../isodraw/src/lib/isoIcons';
export { layoutLevel, settleLevel } from '../../isodraw/src/lib/layout';
export type { Diagram, DiagramNode, DiagramEdge, ShapeKind, LineStyle } from '../../isodraw/src/lib/types';
