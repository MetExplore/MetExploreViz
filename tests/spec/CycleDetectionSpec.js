describe("GraphStyleEdition", function() {

    var graph;
    var flag;

    beforeEach(function () {
        graph =  [[1], [2], [3], [4], [0,5], [6], [7], [0,3]];
        flag = "Single";
    });

    describe("Johnson cycle enumeration algorithm", function() {
        it("should return an array of array", function() {
            expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, flag) ).toBeDefined();
            expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, "All") ).toBeDefined();
            expect( typeof metExploreD3.GraphFunction.JohnsonAlgorithm(graph, flag) ).toBe(typeof []);
	    expect( typeof metExploreD3.GraphFunction.JohnsonAlgorithm(graph, "All") ).toBe(typeof []);
            expect( typeof metExploreD3.GraphFunction.JohnsonAlgorithm(graph, flag)[0] ).toBe(typeof []);
	    expect( typeof metExploreD3.GraphFunction.JohnsonAlgorithm(graph, "All")[0] ).toBe(typeof []);
        });
        it("should return the correct number of cycles", function() {
            expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, flag).length ).toBe(2);
            expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, "All").length ).toBe(3);
        });
	it("the cycles returned should be the expected ones", function() {
	    expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, flag)[0] ).toEqual([0, 1, 2, 3, 4]);
	    expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, flag)[1] ).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
	    expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, "All")[0] ).toEqual([0, 1, 2, 3, 4]);
	    expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, "All")[1] ).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
	    expect( metExploreD3.GraphFunction.JohnsonAlgorithm(graph, "All")[2] ).toEqual([3, 4, 5, 6, 7]);
        });
    });
});
