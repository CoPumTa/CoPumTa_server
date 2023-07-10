const User = require('../../models/user');

exports.postInfo = async (req, res) => {
  console.log("postInfo logic");
  const { cummulativeTime, todaysTime, points, githubId, badge, userId} = req.body;
  const target = await User.findOne({where: { userId: userId }})  
  target.set({
    cummulativeTime: cummulativeTime || target.cummulativeTime,
    todaysTime: todaysTime || target.todaysTime,
    points: points || target.points,
    githubId: githubId || target.githubId,
    badge: badge || target.badge,
  })
  res.status(201);
  res.json(JSON.stringify(target));
}

exports.getInfo = async (req, res) => {
  console.log("getInfo logic");
  const id = req.user.userId;
  console.log("require imformaion of id: ", id);
  const result = await User.findOne({where: { userId: id }});
  res.json(JSON.stringify(result));
}

exports.test = async (req, res) => {
  const userA = await User.findOne({where: {userId: 1}});
  const userB = await User.findOne({where: {userId: 2}});
  const userC = await User.findOne({where: {userId: 3}});
  await userA.addFriend(userB);
  return res.send("ok");
}

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findOne({where: {userId: req.user.userId}});
    if (!user) throw new Error('User not found!');
    const friends = await user.getFriends();
    res.status(200);
    res.json(JSON.stringify(friends));
  } catch (error) {
    res.send(error.message)
  }
}

exports.friendRequest = async (req, res) => {
  console.log("friendRequest logic");
  if (req.body.requesteeId != req.user.id) {
    console.log('Send friend request');
    req.user.addRequestees(req.body.requesteeId)
      .then(result => res.status(201).send(result));
  } else {
    res.status(400).send('Cannot friend yourself');
  }
}

exports.processRequest = async (req, res) => {
  console.log("friendRequest logic");
  console.log(req.body.requesterId);
  console.log(req.user.userId);
  if (req.body.requesterId != req.user.id) {
    const requester = await User.findOne({where: {userId: req.body.requesterId}});
    const requestee = await User.findOne({where: {userId: req.user.userId}});
    const result = await req.user.removeRequestees(req.body.requesterId)
    if(req.body.isSurock){
      console.log("Request accepted");
      await requester.addFriend(requestee);
      await requestee.addFriend(requester);
    } else {
      console.log("Request declined");
    }
    res.status(201);
    res.send();
  } else {
    res.status(400).send('Cannot friend yourself');
  }
}
