import React, { useCallback, useState } from 'react';
import { 
  ReactFlow, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  Controls, 
  Background,
  Connection,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowNode } from '../components/FlowBuilder/FlowNode';
import { NodePalette } from '../components/FlowBuilder/NodePalette';
import { Save, Play, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  flowNode: FlowNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'flowNode',
    position: { x: 250, y: 100 },
    data: { 
      label: 'New DM Trigger',
      nodeType: 'trigger',
      config: { event: 'message_received' }
    },
  },
];

const initialEdges: Edge[] = [];

export const FlowBuilder: React.FC = () => {
  const { setCurrentPage, addFlow } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('Untitled Flow');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeSelect = (nodeType: string, nodeId: string) => {
    const newNode = {
      id: uuidv4(),
      type: 'flowNode',
      position: { x: Math.random() * 500 + 100, y: Math.random() * 400 + 200 },
      data: {
        label: nodeId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        nodeType: nodeType,
        config: { type: nodeId }
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const handleSaveFlow = () => {
    const newFlow = {
      id: uuidv4(),
      name: flowName,
      description: `Flow with ${nodes.length} nodes`,
      isActive: false,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.data?.nodeType || 'action',
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id!,
        source: edge.source,
        target: edge.target,
        type: edge.type
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0
    };

    addFlow(newFlow);
    setCurrentPage('flows');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentPage('flows')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="text-xl font-bold text-gray-900 bg-transparent border-0 focus:ring-0 p-0"
            />
            <p className="text-sm text-gray-600">Visual Flow Builder</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Play className="h-4 w-4" />
            <span>Test Flow</span>
          </button>
          <button 
            onClick={handleSaveFlow}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            <Save className="h-4 w-4" />
            <span>Save Flow</span>
          </button>
        </div>
      </div>

      {/* Flow Builder */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <Background color="#f3f4f6" gap={20} />
          </ReactFlow>
        </div>
        <NodePalette onNodeSelect={handleNodeSelect} />
      </div>
    </div>
  );
};