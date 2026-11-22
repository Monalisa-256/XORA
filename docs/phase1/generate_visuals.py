from pathlib import Path
import html
import cairosvg
out=Path('/mnt/data/XORA_PHASE1/visuals')
BG='#11101B'; PANEL='#1F1C2F'; PANEL2='#28243A'; GOLD='#EEC78B'; TEXT='#F7F3F0'; MUTED='#ADA7BD'; LINE='#443D52'; GREEN='#87D7B4'

def R(x,y,w,h,fill,rx=0,stroke=None,sw=1):
 s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"'
 if stroke:s+=f' stroke="{stroke}" stroke-width="{sw}"'
 return s+'/>'
def T(x,y,v,size=18,fill=TEXT,weight=400,anchor='start',spacing=None):
 kw=f' letter-spacing="{spacing}"' if spacing is not None else ''
 return f'<text x="{x}" y="{y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{kw}>{html.escape(str(v))}</text>'
def circle(cx,cy,r,fill):return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" />'
def button(x,y,w,h,label,primary=True):return R(x,y,w,h,GOLD if primary else '#393249',11)+T(x+w/2,y+h/2+6,label,15,'#201923' if primary else TEXT,750,'middle')
def wrap(*els):return ''.join(els)
def save(name,width,height,contents):
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}"><defs><linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#30213B"/><stop offset="1" stop-color="#5A3647"/></linearGradient><linearGradient id="p1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#80586F"/><stop offset="1" stop-color="#48426E"/></linearGradient><linearGradient id="p2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#658089"/><stop offset="1" stop-color="#43465E"/></linearGradient></defs>{R(0,0,width,height,BG)}{contents}</svg>'
 (out/(name+'.svg')).write_text(svg,encoding='utf-8')
 cairosvg.svg2png(bytestring=svg.encode('utf-8'),write_to=str(out/(name+'.png')))

# Landing desktop
parts=[]
parts += [R(0,0,1440,78,'#181626'),R(94,21,38,38,GOLD,12),T(112,49,'X',24,'#241B24',850,'middle'),T(146,48,'XORA',24,TEXT,850,spacing=3),T(420,48,'How it works',14,MUTED,600),T(561,48,'Pricing',14,MUTED,600),T(668,48,'Safety',14,MUTED,600),button(1179,18,169,43,'Join free',True)]
parts += [R(92,111,1256,432,'url(#hero)',24),T(148,177,'PREMIUM CONNECTIONS · ADULTS ONLY',15,GOLD,800,spacing=2),T(146,256,'Meet people.',61,TEXT,850),T(146,329,'On your terms.',65,GOLD,850),T(148,390,'Date, Casual or Both. One account, private discovery,',18,'#DFD5DC'),T(148,422,'and real control over who you connect with.',18,'#DFD5DC'),button(148,457,226,52,'Join XORA for free'),button(387,457,190,52,'Explore preview',False),T(1110,449,'X',315,'#765668',850,'middle')]
parts += [T(94,608,'One platform. Two ways to connect.',30,TEXT,800),R(92,639,611,171,PANEL,18,LINE),R(719,639,629,171,PANEL,18,LINE),T(123,682,'01 / XORA DATE',14,GOLD,800),T(123,725,'Give romance room to grow',23,TEXT,750),T(123,759,'Meaningful dating and relationship intentions.',15,MUTED),T(751,682,'02 / XORA CASUAL',14,GOLD,800),T(751,725,'Be clear about your chemistry',23,TEXT,750),T(751,759,'Respectful casual dating, with shared boundaries.',15,MUTED)]
parts += [R(0,860,1440,40,'#171524'),T(721,885,'FICTIONAL PHASE 1 VISUAL BOARD  •  NOT A LIVE WEBSITE',13,MUTED,650,'middle')]
save('01_landing_desktop',1440,900,wrap(*parts))

# Mobile discovery
p=[]
p += [R(0,0,390,70,'#1A1728'),R(17,17,34,34,GOLD,10),T(34,42,'X',23,'#211725',850,'middle'),T(63,42,'XORA',22,TEXT,850,spacing=2),T(348,42,'◯',27,GOLD,650,'middle')]
p += [T(17,107,'PRIVATE MEMBER DISCOVERY',11,GOLD,750,spacing=2),T(17,149,'Discover',31,TEXT,850),T(17,176,'People who share your intentions.',13,MUTED)]
p += [R(16,199,358,103,PANEL,16,LINE),T(29,223,'DISCOVERY INTENTION',10,MUTED,700,spacing=1),R(28,235,333,49,'#28243A',11),R(140,239,104,41,GOLD,9),T(87,265,'Date',13,MUTED,750,'middle'),T(192,265,'Casual',13,'#231B22',750,'middle'),T(299,265,'Both',13,MUTED,750,'middle')]
p += [T(17,337,'Suggested profiles',21,TEXT,800)]
for x,name,age,area,letter,grad in [(16,'Amina','27','Ntinda, Kampala','A','url(#p1)'),(204,'Lillian','28','Bukoto, Kampala','L','url(#p2)')]:
 p += [R(x,357,171,302,PANEL,16,LINE),R(x,357,171,185,grad,16),circle(x+84,432,46,'#5A455F' if name=='Amina' else '#445B65'),T(x+85,477,letter,83,'#FAF4F0',850,'middle')]
 p += [R(x+10,514,108,17,'#231e2d',5),T(x+64,526,'FICTIONAL DEMO',9,TEXT,700,'middle'),T(x+11,566,f'{name}, {age}',17,TEXT,800),T(x+11,585,area,11,MUTED,600),R(x+11,597,93,20,'#234338',10),T(x+57,611,'Reviewed',11,GREEN,750,'middle'),button(x+11,621,149,32,'View profile',True)]
p += [R(16,680,358,54,PANEL,14,LINE),T(35,712,'Your first accepted outgoing introduction is free',12,TEXT,650)]
p += [R(0,760,390,84,'#1A1728'),T(39,798,'⌕',23,GOLD,700,'middle'),T(115,798,'♡',23,MUTED,700,'middle'),T(191,798,'✉',23,MUTED,700,'middle'),T(265,798,'◇',23,MUTED,700,'middle'),T(344,798,'○',23,MUTED,700,'middle')]
p += [T(39,821,'Discover',10,GOLD,700,'middle'),T(115,821,'Invites',10,MUTED,700,'middle'),T(191,821,'Messages',10,MUTED,700,'middle'),T(265,821,'Plans',10,MUTED,700,'middle'),T(344,821,'Profile',10,MUTED,700,'middle')]
save('02_discovery_mobile',390,844,wrap(*p))

# Manual payment mobile
p=[]
p += [R(0,0,390,69,'#1A1728'),T(20,42,'‹',34,GOLD,600),T(61,42,'XORA',22,TEXT,850,spacing=2),T(355,42,'03/03',12,MUTED,650,'end')]
p += [T(20,104,'MANUAL PAYMENT',11,GOLD,800,spacing=2),T(20,147,'Submit transfer',29,TEXT,800),T(20,179,'details',29,TEXT,800),T(20,207,'No automatic access until staff verification.',12,MUTED)]
p += [R(16,230,358,515,PANEL,18,LINE),T(36,266,'ORDER XORA-DEMO-1002',14,GOLD,760),T(36,297,'Connect Month',18,TEXT,800),T(36,332,'UGX 25,000',30,TEXT,850),R(36,351,317,1,LINE),T(36,386,'Payment channel',13,TEXT,700),R(36,395,318,46,'#171522',10,LINE),T(53,425,'MTN MoMo (demo)',14,TEXT,600),T(36,470,'Transaction reference',13,TEXT,700),R(36,480,318,47,'#171522',10,LINE),T(53,508,'DEMO-TXN-987654',14,MUTED),T(36,557,'Sending number (masked)',13,TEXT,700),R(36,568,318,47,'#171522',10,LINE),T(53,596,'07xx xxx 123',14,MUTED),T(36,646,'Screenshot optional, never proof of settled funds.',10,MUTED),button(36,673,318,47,'Submit for manual review')]
p += [R(16,766,358,56,'#403326',14,'#886e44'),T(31,788,'DEMO ONLY — DO NOT SEND MONEY',11,'#F4CF86',850),T(31,806,'No real recipient or transfer processing.',10,'#F3D2A8')]
save('03_manual_payment_mobile',390,844,wrap(*p))

# Admin finance desktop
p=[]
p += [R(0,0,1440,74,'#181626'),R(42,17,38,38,GOLD,10),T(60,46,'X',24,'#241B24',850,'middle'),T(94,45,'XORA',23,TEXT,850,spacing=2),R(212,23,109,28,'#393047',14),T(266,42,'STAFF DEMO',11,TEXT,800,'middle'),T(1295,42,'Return to member',14,GOLD,700,'middle')]
p += [R(32,102,245,744,'#1D1A2A',17,LINE)]
for i,label in enumerate(['Overview','Payment reviews','Profile reviews','Safety & support','Members','Settings / audit']):
 y=124+i*61
 if i==1:p += [R(45,y,216,46,'#544061',10)]
 p += [T(64,y+30,label,16,TEXT if i==1 else MUTED,700)]
p += [T(315,128,'MANUAL PAYMENT REVIEW',12,GOLD,800,spacing=2),T(315,169,'Review XORA-DEMO-1002',30,TEXT,850),T(315,199,'Verify settled funds independently before activating an entitlement.',15,MUTED)]
p += [R(315,235,464,450,PANEL,17,LINE),T(342,273,'ORIGINAL ORDER',13,GOLD,800,spacing=2),T(342,323,'Connect Month',24,TEXT,850),T(342,367,'Expected amount',14,MUTED),T(734,367,'UGX 25,000',17,TEXT,800,'end'),R(342,389,409,1,LINE),T(342,423,'Provider reference',14,MUTED),T(751,423,'DEMO-TXN-987654',14,TEXT,700,'end'),T(342,463,'Payment method',14,MUTED),T(751,463,'MTN MoMo (demo)',14,TEXT,700,'end'),T(342,503,'Recipient verification',14,MUTED),T(751,503,'Not yet independently verified',13,'#F4CF86',700,'end'),R(342,536,408,105,'#372D34',12),T(358,563,'A screenshot is a member claim,',15,'#EAC9B6',700),T(358,589,'not evidence of settled money.',15,'#EAC9B6',700),T(358,615,'Use the official receiving-account record.',12,MUTED)]
p += [R(801,235,600,558,PANEL,17,LINE),T(828,273,'INDEPENDENT FUNDS CHECKLIST',13,GOLD,800,spacing=1.5)]
check=[('Official business recipient matches',False),('Funds settled in actual account',False),('Received amount equals UGX 25,000',False),('Transaction reference not reused',False),('Member eligible, no prior approval',False)]
for i,(label,checked) in enumerate(check):
 y=300+i*62
 p += [R(827,y,544,51,'#2B2639',10,LINE),R(844,y+14,22,22,'#1B1729',4,'#776484'),T(884,y+33,label,15,TEXT,620)]
p += [R(827,631,544,58,'#5C4E55',11),T(1099,669,'Confirm and activate once  (disabled)',15,'#C6BBC7',700,'middle'),button(827,709,207,49,'Request correction',False),T(1065,739,'Audit actor + reason required',12,MUTED)]
p += [T(321,840,'ALL RECORDS SHOWN ARE FICTIONAL.  THE DEMO IS NOT A PAYMENT SYSTEM.',12,MUTED,650)]
save('04_admin_finance_desktop',1440,900,wrap(*p))
print('generated', sorted(p.name for p in out.iterdir()))
