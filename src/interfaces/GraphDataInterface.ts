interface GraphDataInterface {
  nodes: [
    {
      id: string;
      questionLabel: string;
      family: string;
    }
  ];
  links: [
    {
      source: string;
      target: string;
    }
  ];
}
