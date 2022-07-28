pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

contract CampaignFactory{
    Campaign[] public deployedCampaigns;

    function createCampaign(uint minimum, string memory name, string memory desc, string memory img ) public {
        Campaign newCampaign=new Campaign(minimum,msg.sender,name,desc,img);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory){
        return deployedCampaigns;
    }
}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping(address=>bool) approvals;
        uint approvalCount;
    }

    uint numRequests;
    mapping(uint=>Request) public requests;

    //Array of Request objects
    // Request[] public requests;

    address public manager;
    uint public minimumContribution;
	string public campaignName;
  	string public campaignDesc;
  	string public imageUrl;

    constructor(uint minimum, address creator,string memory name, string memory desc, string memory url ) {
        manager=creator;
        minimumContribution=minimum;
		campaignName=name;
		campaignDesc=desc;
		imageUrl=url;
    }
    //Array of address objects
    // address[] public approvers;
    //Use mapping for constant search time
    mapping(address=>bool) public approvers;
    uint public approversCount;

    //reducing lines of code 
    modifier restricted(){
        //Make sure only the manager can call this function
        require(msg.sender == manager,"You are not authorized!");
        //Code inside the function having this modifier is copied in place of this underscore  
        _;
    }


    function contribute() public payable{
		
		require(msg.value>minimumContribution);
		
		if (!approvers[msg.sender]){
			approversCount++;
		}
        	
        // approvers.push(msg.sender);
        approvers[msg.sender]=true;
        
    }


    //Create new request (only by Manager)
    function createRequest( string memory description, uint value, address payable recipient) public restricted {
        //If msg.sender is true in approvers, then continue
        require(approvers[msg.sender]);

        require(value <= address(this).balance);
        //Create new request
        Request storage newRequest = requests[numRequests];

        //Increase number of requests
        numRequests++;
        
        //Set request information
        newRequest.description=description;
        newRequest.value=value;
        newRequest.recipient=recipient;
        newRequest.complete=false;
        newRequest.approvalCount=0;

        //Alternate syntax based on consistent order of fields 
        //Request(description,value,recipient,false);

        // requests.push(newRequest);
    }

    function approveRequest(uint index) public{
        //Get request from provided index
        Request storage request = requests[index];
        
        //Check if sender in approvers array
        require(approvers[msg.sender]);

        //Check if already approved or not
        require(!request.approvals[msg.sender]);

        //Set approved to true
        request.approvals[msg.sender] = true;

        //Increase the yes count
        request.approvalCount++;
    }

	function hasApproved(uint index) public view returns (bool) {         
    	return requests[index].approvals[msg.sender];     
	}

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount>(approversCount/2));
        request.recipient.transfer(request.value);
        request.complete=true;

    }

	function getSummary() public view returns (uint,uint,uint,uint,address,string memory,string memory,string memory){
		return(minimumContribution,address(this).balance,numRequests, approversCount, manager, campaignName,campaignDesc,imageUrl
	);
	}

    // function getRequests() public view returns (Request[] memory){
    //     Request[] memory ret = new Request[](numRequests);
    //     for (uint i = 0; i < numRequests; i++) {
    //         ret[i] = requests[i];
    //     }
    //     return ret;
    // }
}