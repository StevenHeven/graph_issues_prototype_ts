import * as React from 'react';
import _ from 'lodash';
import { Col} from 'react-grid-system';
import { toast } from 'react-toastify';
import { Collapse, createStyles, Grid, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Switch, Theme, Tooltip, Typography, withStyles } from '@material-ui/core';
import { Log } from 'ng2-logger/browser';
import { ExpandLess, ExpandMore } from '@material-ui/icons';


import DiagramResult from '../../components/DiagramResult/DiagramResult';
import TypeQuestionsEnum from '../../enum/TypeQuestionsEnum';
import NodeEditDialog from '../../components/DiagramResult/NodeEditDialog';
import QuestionNodeSvg from '../../components/DiagramResult/QuestionNodeSvg';
import IconTypeQuestion from '../../components/IconTypeQuestion/IconTypeQuestion';
import DirectionQuestionNeighbour from '../../enum/DirectionQuestionNeighbour';
import NodeDeleteDialog from '../../components/DiagramResult/NodeDeleteDialog';
import LoaderData from "../../components/LoaderDatas/LoaderData";
import graphData from "../../data/graphData";

const log = Log.create('ResultGraphContainer');
const styles = (theme: Theme) =>
    createStyles({
        timeLine: {
            marginTop: '50px'
        },
        diagramContainer: {
            marginTop: '50px',
            border: '3px solid',
            borderColor: theme.palette.secondary.main,
            borderRadius: '15px',
            marginBottom: '50px',
            zIndex: 1
        },
        nested: {
            paddingLeft: theme.spacing.unit * 4
        }
    });

interface ResultGraphProps {
    classes?
}

interface ResultGraphState {
    data: any;
    isLoading: boolean;
}

class ResultGraph extends React.Component<ResultGraphProps, ResultGraphState> {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoading: true
        };
    }

    async componentDidMount() {
        try {
            await this.loadData();
        } catch (error) {
            toast.error('Impossible de récupérer le graph correspondant. Problème de connexion au serveur.');
            log.info('Impossible to recover corresponding graph', error);
        }
    }


    /**
     * Method to have the number of rank in function of children nodes
     * @param listOfLinks - List of links needed
     * @param nodeFocusId - Id of node focus at start
     */
    getRankNodeInFunctionOfLinks(listOfLinks, nodeFocusId: string) {
        let numberOfRank = 0;
        const startList = _.cloneDeep(listOfLinks);

        // We iterate on the list of links and if our node is a source,
        // we then delete the links where it is source and we look again for the target node if it has links too
        startList.map(link => {
            if (link.source === nodeFocusId) {
                _.remove(startList, { source: nodeFocusId });
                numberOfRank++;
                numberOfRank += this.getRankNodeInFunctionOfLinks(startList, link.target);
            }
        });
        return numberOfRank;
    }

    fillNodeToMapAndGraphArray(nodeGraphInSameLine, nodesByRank, value, graphNodesTemp) {
        const nodeGraphInSameLineOrdered = _.orderBy(nodeGraphInSameLine, ['positionInLine', 'asc']);
        nodesByRank.set(value, nodeGraphInSameLineOrdered);

        nodeGraphInSameLineOrdered.map(nodeToPush => graphNodesTemp.push(nodeToPush));

    }

    render() {

        const { classes } = this.props;
        const { data, isLoading} = this.state;

        if (isLoading) {
            return <LoaderData text={'Chargement de l\'arbre correspondant.'}/>;
        }

        // @ts-ignore
        return (
            <div>
                <Col xl={10} md={10} offset={{ xl: 1, md: 1 }} className={classes.diagramContainer}>
                    <DiagramResult model={data}/>
                </Col>
            </div>
        );
    }

    async loadData() {
        const graphNodes = new Array(0);
        const graphNodesTemp = new Array(0);
        const numberChildrenByIdNodes = new Map();
        const nodesByRank = new Map();
        const nodesToNotAppear = new Array(0);
        const sizeOfGraph = 1700;
        const marginBetweenNodes = 200;

        // Initialize all variables which will changing :
        //    actualRank : informed on which rank we are
        //    xNode : position x of node
        //    yNode : position y of node
        //    positionInLine : informed position of node in same line
        //    nodeGraphInSameLine : nodes array in same rank
        let actualRank = 0;
        let xNode = 0;
        let yNode = 0;
        let positionNodeInLine = 1;
        let nodeGraphInSameLine = new Array(0);


        // First, we search links with AND nodes without children or parents in Array
        const allAndNodes = graphData.nodes.filter(node => node.family === TypeQuestionsEnum.AND);
        const linksForAndWithNoChildrenOrNoParents = new Array(0);
        allAndNodes.map(andNode => {
            const andNodeWithTarget = graphData.links.filter(link => link.source === andNode.id);
            const andNodeWithSource = graphData.links.filter(link => link.target === andNode.id);
            if (andNodeWithTarget.length === 0 || andNodeWithSource.length === 0) {
                linksForAndWithNoChildrenOrNoParents.push(andNode);
            }
        });

        // With last array, we're gonna find node thanks to links
        graphData.nodes.map(node => linksForAndWithNoChildrenOrNoParents.find(nodeAnd => nodeAnd.id === node.id) !== undefined && nodesToNotAppear.push(node));

        // We're gonna search nodes associate with AND nodes which have no children or parents
        nodesToNotAppear.map(node => {
            const linksAffiliate = graphData.links.filter(link => link.target === node.id);
            linksAffiliate.map(link => {
                const getAlsoParent = graphData.links.filter(linkParent => linkParent.target === link.source);
                if (getAlsoParent.length === 0) {
                    const nodeToNotAppear = graphData.nodes.find(nodeToFound => nodeToFound.id === node.id);
                    nodesToNotAppear.push(nodeToNotAppear);
                }
            });
            _.remove(graphData.links, link => link.source === node.id || link.target === node.id);
        });


        // Get rank node by rank
        graphData.nodes.map(node => {

            // We filter links object to find if this node have links associate
            // If yes, we check if node it's not contains of nodeToNotAppear Array to add him
            const nodesWithLinks = graphData.links.filter(link => link.source === node.id || link.target === node.id);
            if (nodesWithLinks.length !== 0) {
                if (linksForAndWithNoChildrenOrNoParents.find(nodeAnd => nodeAnd.id === node.id) === undefined) {
                    // Get the rank of nodes in function of his links (number children nodes)
                    const numberOfLevelNode = this.getRankNodeInFunctionOfLinks(graphData.links, node.id);
                    numberChildrenByIdNodes.set(node.id, numberOfLevelNode);
                }
            }
        });


        // Sort map in function of nodes rank asc
        // @ts-ignore
        const numberChildrenByIdNodesSortedByValues = new Map([...numberChildrenByIdNodes.entries()].sort((a, b) => a[1] - b[1]));
        const lastNode = Array.from(numberChildrenByIdNodesSortedByValues.entries()).pop();

        // Iterate map on all nodes vertically
        numberChildrenByIdNodesSortedByValues.forEach((value: number, key: string) => {

            // Get the node matching
            const nodeFound = graphData.nodes.find(nodeInArray => nodeInArray.id === key);


            // If we're not in the same last rank, we increment y position, adjust actualRank and reinitialize positionNodeInLine
            // And we add on map all node in last rank ordered by position by their rank
            // And we add on temp array nodes with all properties but x position set after
            if (value !== actualRank) {

                this.fillNodeToMapAndGraphArray(nodeGraphInSameLine, nodesByRank, value - 1, graphNodesTemp);

                yNode += 200;
                actualRank = value;
                positionNodeInLine = 1;
                nodeGraphInSameLine = [];
            }


            // Got all children links
            const linksChild = graphData.links.filter(link => link.source === key);

            let nodePosition = 1;
            if (linksChild.length !== 0) {
                const firstParent = graphNodesTemp.find(node => node.id === linksChild[0].target);
                if (firstParent !== undefined) {
                    nodePosition = (firstParent.positionInLine * 10) + positionNodeInLine;
                }
            } else {
                nodePosition = positionNodeInLine;
            }


            // We add on array node with all properties except x position

            nodeGraphInSameLine.push({
                id: nodeFound.id,
                questionLabel: nodeFound.questionLabel,
                family: nodeFound.family,
                size: nodeFound.family === TypeQuestionsEnum.AND && 500,
                graphRank: value,
                positionInLine: nodePosition,
                y: yNode
            });

            // For the last node, as we not pass again in first block where we fill map and push in array.
            if (key === lastNode[0]) {
                this.fillNodeToMapAndGraphArray(nodeGraphInSameLine, nodesByRank, value, graphNodesTemp);
            }

            positionNodeInLine++;

        });

        const lastNodeWithAllProperties = graphNodesTemp.find(nodeInArray => nodeInArray.id === lastNode[0]);

        // We iterate on map which has rank in index and an array of Nodes in same rank.
        // And we iterate on this node array to set in horizontal vision x node position
        nodesByRank.forEach((nodesArray: NodeInterface[], rank: number) => {
            let xIndex = 1;
            nodesArray.map(nodeToPosition => {

                const linksChild = graphData.links.filter(link => link.source === nodeToPosition.id);
                const linksParent = graphData.links.filter(link => link.target === nodeToPosition.id);
                const conditionNoLinks = linksParent.length === 0 && linksChild.length === 0;

                xNode = (sizeOfGraph - marginBetweenNodes * nodesArray.length) / 2 + marginBetweenNodes * xIndex;
                graphNodes.push({
                    ...nodeToPosition,
                    positionInLine: nodeToPosition.positionInLine,
                    x: xNode,
                    y: conditionNoLinks ? lastNodeWithAllProperties.y + 400 : nodeToPosition.y          // In case of node have no links associate, we put him in bottom with 1 difference line
                });


                xIndex++;

            });

        });

        this.setState({
            data: {
                nodes: graphNodes,
                links: graphData.links
            },
            isLoading: false
        });
    }
}

export default withStyles(styles)(ResultGraph);
