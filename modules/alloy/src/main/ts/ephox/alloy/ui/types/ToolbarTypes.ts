import { AlloyBehaviourRecord } from '../../api/behaviour/Behaviour';
import { AlloyComponent } from '../../api/component/ComponentApi';
import { SketchBehaviours } from '../../api/component/SketchBehaviours';
import { AlloySpec, RawDomSchema } from '../../api/component/SpecTypes';
import { CompositeSketch, CompositeSketchDetail, CompositeSketchSpec } from '../../api/ui/Sketcher';

export interface ToolbarDetail extends CompositeSketchDetail {
  uid: string;
  dom: RawDomSchema;
  toolbarBehaviours: SketchBehaviours;

  shell: boolean;
}

export interface ToolbarSpec extends CompositeSketchSpec {
  uid?: string;
  dom: RawDomSchema;
  components?: AlloySpec[];
  toolbarBehaviours?: AlloyBehaviourRecord;

  shell?: boolean;
}

export interface ToolbarApis {
  setGroups: (toolbar: AlloyComponent, groups: AlloySpec []) => void;
  // cherry-customized--start
  // 设置预览气泡框内容
  setPopoverContain: (popover: AlloyComponent, elements: Element) => void;
  // cherry-customized--end
}

export interface ToolbarSketcher extends CompositeSketch<ToolbarSpec>, ToolbarApis { }
